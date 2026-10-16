import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
} from '../services/googleAuth';
import {
  findExistingSpreadsheet,
  getOrCreateSpreadsheet,
  fetchEvaluationsFromSheet,
  saveEvaluationToSheet,
  removeEvaluationFromSheet,
  clearAllEvaluationsFromSheet,
  SpreadsheetMetadata,
  SheetEvaluationRecord,
  OwnerSheetConfig,
  getStoredOwnerConfig,
  saveStoredOwnerConfig,
  saveEvaluationViaWebhook,
  removeEvaluationViaWebhook,
  fetchEvaluationsViaWebhook,
  testWebhookConnection,
} from '../services/googleSheetsService';
import { EvaluationResult, StoredEvaluation } from '../types/wellness';

const STORAGE_SAVED_IDS = 'equilibria_sheet_saved_ids';

interface GoogleSheetsContextType {
  // Auth state (OAuth)
  user: User | null;
  accessToken: string | null;
  isConnected: boolean; // OAuth connected
  spreadsheet: SpreadsheetMetadata | null;
  sheetRecords: SheetEvaluationRecord[];
  
  // Third party / Owner Sheet configuration
  ownerConfig: OwnerSheetConfig;
  isThirdPartyReady: boolean;
  isConfigModalOpen: boolean;
  setIsConfigModalOpen: (open: boolean) => void;
  updateOwnerConfig: (config: Partial<OwnerSheetConfig>) => void;
  testWebhook: () => Promise<{ success: boolean; message: string }>;

  // Loading & status
  isLoading: boolean;
  isAuthenticating: boolean;
  isSaving: boolean;
  isRemoving: boolean;
  statusMessage: { type: 'success' | 'error' | 'info'; text: string } | null;

  // Actions
  signIn: () => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshRecords: () => Promise<void>;
  saveRecord: (evaluation: EvaluationResult | StoredEvaluation) => Promise<boolean>;
  removeRecord: (evalId: string) => Promise<boolean>;
  clearAllRecords: () => Promise<boolean>;
  isRecordSaved: (evalId: string) => boolean;
  clearStatusMessage: () => void;
}

const GoogleSheetsContext = createContext<GoogleSheetsContextType | undefined>(undefined);

export const GoogleSheetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetMetadata | null>(null);
  const [sheetRecords, setSheetRecords] = useState<SheetEvaluationRecord[]>([]);
  
  // Owner & Webhook Config
  const [ownerConfig, setOwnerConfig] = useState<OwnerSheetConfig>(() => getStoredOwnerConfig());
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [locallySavedIds, setLocallySavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_IDS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [pendingRecord, setPendingRecord] = useState<EvaluationResult | StoredEvaluation | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const isThirdPartyReady = Boolean(ownerConfig.webhookUrl && ownerConfig.webhookUrl.trim().length > 10 && ownerConfig.enabled);

  // Clear toast after 4.5s
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const clearStatusMessage = useCallback(() => {
    setStatusMessage(null);
  }, []);

  const addLocallySavedId = useCallback((id: string) => {
    setLocallySavedIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      try {
        localStorage.setItem(STORAGE_SAVED_IDS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not store saved IDs:', e);
      }
      return updated;
    });
  }, []);

  const removeLocallySavedId = useCallback((id: string) => {
    setLocallySavedIds((prev) => {
      const updated = prev.filter((item) => item !== id);
      try {
        localStorage.setItem(STORAGE_SAVED_IDS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not store saved IDs:', e);
      }
      return updated;
    });
  }, []);

  // Update Owner Config & auto-save pending record if webhook is now ready
  const updateOwnerConfig = useCallback((newConfig: Partial<OwnerSheetConfig>) => {
    const updated = saveStoredOwnerConfig(newConfig);
    setOwnerConfig(updated);

    if (updated.webhookUrl && updated.enabled && pendingRecord) {
      saveEvaluationViaWebhook(updated.webhookUrl, pendingRecord)
        .then((res) => {
          if (res.success) {
            addLocallySavedId(pendingRecord.id);
            setPendingRecord(null);
            setStatusMessage({
              type: 'success',
              text: '¡Configuración guardada y evaluación registrada exitosamente en Google Sheets!',
            });
          }
        })
        .catch((err) => {
          console.warn('Could not auto-save pending record via webhook:', err);
        });
    }
  }, [pendingRecord, addLocallySavedId]);

  // Test Webhook
  const testWebhook = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (!ownerConfig.webhookUrl) {
      return { success: false, message: 'Ingresa la URL del Webhook antes de probar.' };
    }
    return testWebhookConnection(ownerConfig.webhookUrl);
  }, [ownerConfig.webhookUrl]);

  // Sync spreadsheet records if token is available
  const loadSpreadsheetData = useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      const sheet = await getOrCreateSpreadsheet(token, ownerConfig.spreadsheetId);
      setSpreadsheet(sheet);
      
      // If we don't have ownerConfig spreadsheet link yet, update it
      if (sheet.id && !ownerConfig.spreadsheetId) {
        updateOwnerConfig({
          spreadsheetId: sheet.id,
          spreadsheetUrl: sheet.webViewLink,
        });
      }

      const records = await fetchEvaluationsFromSheet(token, sheet.id);
      setSheetRecords(records);
    } catch (err: any) {
      console.error('Error loading spreadsheet data:', err);
      setStatusMessage({
        type: 'error',
        text: `Error al acceder a Google Sheets: ${err?.message || 'Error desconocido'}`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [ownerConfig.spreadsheetId, updateOwnerConfig]);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = initAuth(
      async (authUser, token) => {
        setUser(authUser);
        if (token) {
          setAccessToken(token);
          await loadSpreadsheetData(token);
        }
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setSpreadsheet(null);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [loadSpreadsheetData]);

  // Load records from Webhook if not authenticated via OAuth but webhook exists
  useEffect(() => {
    if (!user && isThirdPartyReady && ownerConfig.webhookUrl) {
      fetchEvaluationsViaWebhook(ownerConfig.webhookUrl).then((records) => {
        if (records.length > 0) {
          setSheetRecords(records);
        }
      });
    }
  }, [user, isThirdPartyReady, ownerConfig.webhookUrl]);

  // Sign In Flow
  const signIn = async (): Promise<boolean> => {
    setIsAuthenticating(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        await loadSpreadsheetData(result.accessToken);

        // Auto-save pending evaluation if one was queued
        if (pendingRecord) {
          try {
            const targetSheet = await getOrCreateSpreadsheet(result.accessToken, ownerConfig.spreadsheetId);
            await saveEvaluationToSheet(result.accessToken, targetSheet.id, pendingRecord);
            addLocallySavedId(pendingRecord.id);
            const fresh = await fetchEvaluationsFromSheet(result.accessToken, targetSheet.id);
            setSheetRecords(fresh);
            setPendingRecord(null);
            setStatusMessage({
              type: 'success',
              text: '¡Conexión establecida y evaluación guardada exitosamente en Google Sheets!',
            });
            return true;
          } catch (pErr) {
            console.warn('Could not auto-save pending record upon login:', pErr);
          }
        }

        setStatusMessage({
          type: 'success',
          text: 'Conectado exitosamente con tu cuenta de Google.',
        });
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Sign in error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setStatusMessage({
          type: 'error',
          text: `No se pudo conectar con Google: ${err?.message || 'Revisa tu conexión'}`,
        });
      }
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Sign Out Flow
  const signOut = async (): Promise<void> => {
    try {
      await logoutGoogle();
      setUser(null);
      setAccessToken(null);
      setSpreadsheet(null);
      setSheetRecords([]);
      setStatusMessage({
        type: 'info',
        text: 'Desconectado de la cuenta de Google.',
      });
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  // Refresh Records
  const refreshRecords = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const token = accessToken || (await getAccessToken());
      if (token) {
        let sheetId = spreadsheet?.id || ownerConfig.spreadsheetId;
        if (!sheetId) {
          const sheet = await getOrCreateSpreadsheet(token);
          setSpreadsheet(sheet);
          sheetId = sheet.id;
        }
        const records = await fetchEvaluationsFromSheet(token, sheetId);
        setSheetRecords(records);
        setStatusMessage({
          type: 'success',
          text: 'Registros de Google Sheets actualizados correctamente.',
        });
      } else if (isThirdPartyReady) {
        const records = await fetchEvaluationsViaWebhook(ownerConfig.webhookUrl);
        setSheetRecords(records);
        setStatusMessage({
          type: 'success',
          text: 'Registros actualizados desde la hoja del evaluador.',
        });
      }
    } catch (err: any) {
      console.error('Error refreshing records:', err);
      const isExpired = err?.message?.includes('SESION_EXPIRADA') || err?.message?.includes('401');
      setStatusMessage({
        type: 'error',
        text: isExpired
          ? 'Tu sesión de Google ha expirado. Haz clic en "Conectar con Google" para renovarla.'
          : 'No se pudieron actualizar los registros de Google Sheets.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save an evaluation to Google Sheets (Supports both OAuth and Webhook for third-party users!)
  const saveRecord = async (evaluation: EvaluationResult | StoredEvaluation): Promise<boolean> => {
    setIsSaving(true);
    setStatusMessage(null);

    // Option A: If owner/user is signed in with Google OAuth
    const token = accessToken || (await getAccessToken());
    if (token) {
      try {
        let targetSpreadsheet = spreadsheet;
        if (!targetSpreadsheet) {
          targetSpreadsheet = await getOrCreateSpreadsheet(token, ownerConfig.spreadsheetId);
          setSpreadsheet(targetSpreadsheet);
        }

        await saveEvaluationToSheet(token, targetSpreadsheet.id, evaluation);
        addLocallySavedId(evaluation.id);
        setPendingRecord(null);

        // Re-fetch records
        const updatedRecords = await fetchEvaluationsFromSheet(token, targetSpreadsheet.id);
        setSheetRecords(updatedRecords);

        setStatusMessage({
          type: 'success',
          text: '¡Evaluación guardada exitosamente en la base de datos de Google Sheets!',
        });
        setIsSaving(false);
        return true;
      } catch (err: any) {
        console.warn('OAuth save error, checking webhook fallback:', err);
        const isExpired =
          err?.message?.includes('SESION_EXPIRADA') ||
          err?.message?.includes('401') ||
          err?.message?.includes('invalid_grant');

        // If webhook is NOT configured, report exact error!
        if (!isThirdPartyReady || !ownerConfig.webhookUrl) {
          setIsSaving(false);
          setStatusMessage({
            type: 'error',
            text: isExpired
              ? 'Tu sesión de Google ha expirado. Haz clic en "Conectar con Google" para renovar el acceso y guardar.'
              : `Error al guardar en Google Sheets: ${err?.message || 'Error desconocido'}`,
          });
          return false;
        }
      }
    }

    // Option B: If Webhook is configured (Frictionless for third-party users/testers!)
    if (isThirdPartyReady && ownerConfig.webhookUrl) {
      try {
        const result = await saveEvaluationViaWebhook(ownerConfig.webhookUrl, evaluation);
        addLocallySavedId(evaluation.id);
        setPendingRecord(null);
        
        // Optimistically add to sheetRecords or refresh
        setSheetRecords((prev) => {
          if (prev.some((r) => r.id === evaluation.id)) return prev;
          const newRec: SheetEvaluationRecord = {
            id: evaluation.id,
            date: evaluation.date,
            userName: evaluation.userName || 'Participante',
            totalScore: evaluation.totalScore,
            pillarScores: evaluation.pillarScores,
            answers: evaluation.answers || {},
            archetypeTitle:
              'archetype' in evaluation && evaluation.archetype
                ? evaluation.archetype.title
                : 'archetypeTitle' in evaluation
                ? (evaluation as StoredEvaluation).archetypeTitle
                : '',
            sheetRowNumber: prev.length + 2,
          };
          return [newRec, ...prev];
        });

        setStatusMessage({
          type: 'success',
          text: result.message || '¡Evaluación guardada en la hoja de cálculo del evaluador!',
        });
        setIsSaving(false);
        return true;
      } catch (webhookErr: any) {
        console.error('Webhook save error:', webhookErr);
        setIsSaving(false);
        setStatusMessage({
          type: 'error',
          text: `Error al guardar en la hoja del evaluador: ${webhookErr?.message || 'Error de conexión'}`,
        });
        return false;
      }
    }

    // Option C: Neither is configured yet -> queue pending record and open config modal
    setPendingRecord(evaluation);
    setIsSaving(false);
    setIsConfigModalOpen(true);
    setStatusMessage({
      type: 'info',
      text: 'Conecta con Google o configura el enlace de la hoja del evaluador para guardar registros automáticamente.',
    });
    return false;
  };

  // Remove an evaluation from Google Sheets
  const removeRecord = async (evalId: string): Promise<boolean> => {
    setIsRemoving(true);
    setStatusMessage(null);

    // Option A: Via OAuth
    const token = accessToken || (await getAccessToken());
    if (token && spreadsheet) {
      try {
        const removed = await removeEvaluationFromSheet(token, spreadsheet.id, evalId);
        if (removed) {
          setSheetRecords((prev) => prev.filter((r) => r.id !== evalId));
          removeLocallySavedId(evalId);
          setStatusMessage({
            type: 'success',
            text: 'Registro quitado correctamente de Google Sheets.',
          });
          setIsRemoving(false);
          return true;
        }
      } catch (err: any) {
        console.warn('OAuth remove error, attempting webhook if available:', err);
      }
    }

    // Option B: Via Webhook
    if (isThirdPartyReady && ownerConfig.webhookUrl) {
      try {
        await removeEvaluationViaWebhook(ownerConfig.webhookUrl, evalId);
        setSheetRecords((prev) => prev.filter((r) => r.id !== evalId));
        removeLocallySavedId(evalId);
        setStatusMessage({
          type: 'success',
          text: 'Registro quitado de la hoja de cálculo del evaluador.',
        });
        setIsRemoving(false);
        return true;
      } catch (webhookErr: any) {
        console.error('Webhook remove error:', webhookErr);
        setStatusMessage({
          type: 'error',
          text: `Error al quitar registro: ${webhookErr?.message || 'Error de conexión'}`,
        });
        setIsRemoving(false);
        return false;
      }
    }

    setIsRemoving(false);
    setStatusMessage({
      type: 'error',
      text: 'No hay conexión activa con Google Sheets para quitar el registro.',
    });
    return false;
  };

  // Clear all records from Google Sheets
  const clearAllRecords = async (): Promise<boolean> => {
    const token = accessToken || (await getAccessToken());
    if (!token || !spreadsheet) return false;

    setIsRemoving(true);
    try {
      await clearAllEvaluationsFromSheet(token, spreadsheet.id);
      setSheetRecords([]);
      setLocallySavedIds([]);
      try {
        localStorage.removeItem(STORAGE_SAVED_IDS);
      } catch {}
      setStatusMessage({
        type: 'success',
        text: 'Se han quitado todos los registros de tu Google Sheets.',
      });
      return true;
    } catch (err: any) {
      console.error('Error clearing sheet:', err);
      setStatusMessage({
        type: 'error',
        text: `Error al vaciar Google Sheets: ${err?.message || 'Error desconocido'}`,
      });
      return false;
    } finally {
      setIsRemoving(false);
    }
  };

  // Check if an evaluation ID is already stored in the Google Sheet
  const isRecordSaved = useCallback(
    (evalId: string): boolean => {
      return (
        sheetRecords.some((r) => r.id === evalId) ||
        locallySavedIds.includes(evalId)
      );
    },
    [sheetRecords, locallySavedIds]
  );

  return (
    <GoogleSheetsContext.Provider
      value={{
        user,
        accessToken,
        isConnected: Boolean(user && accessToken),
        spreadsheet,
        sheetRecords,
        ownerConfig,
        isThirdPartyReady,
        isConfigModalOpen,
        setIsConfigModalOpen,
        updateOwnerConfig,
        testWebhook,
        isLoading,
        isAuthenticating,
        isSaving,
        isRemoving,
        statusMessage,
        signIn,
        signOut,
        refreshRecords,
        saveRecord,
        removeRecord,
        clearAllRecords,
        isRecordSaved,
        clearStatusMessage,
      }}
    >
      {children}
    </GoogleSheetsContext.Provider>
  );
};

export function useGoogleSheets() {
  const context = useContext(GoogleSheetsContext);
  if (!context) {
    throw new Error('useGoogleSheets must be used within a GoogleSheetsProvider');
  }
  return context;
}
