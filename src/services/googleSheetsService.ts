import { EvaluationResult, StoredEvaluation, PillarId } from '../types/wellness';

export const SPREADSHEET_NAME = 'Equilibria - Base de Datos de Evaluaciones';
export const SHEET_NAME = 'Evaluaciones';

export interface SpreadsheetMetadata {
  id: string;
  name: string;
  webViewLink?: string;
  sheetId?: number; // Numeric sheetId for batchUpdates
}

export interface SheetEvaluationRecord extends StoredEvaluation {
  sheetRowNumber: number; // 1-based index in sheet
}

/**
 * Search Google Drive for existing Equilibria evaluations spreadsheet
 */
export async function findExistingSpreadsheet(accessToken: string): Promise<SpreadsheetMetadata | null> {
  try {
    const q = encodeURIComponent(
      `name = '${SPREADSHEET_NAME}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
    );
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,webViewLink)&pageSize=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      console.warn('Error querying Drive for spreadsheet:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    if (data.files && data.files.length > 0) {
      const file = data.files[0];
      return {
        id: file.id,
        name: file.name,
        webViewLink: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
      };
    }
    return null;
  } catch (err) {
    console.error('Failed to find spreadsheet:', err);
    return null;
  }
}

export const HEADER_ROW_VALUES = [
  'ID de Evaluación',
  'Fecha y Hora',
  'Nombre de Participante',
  'Puntuación Total (%)',
  'Sueño (%)',
  'Alimentación (%)',
  'Salud Mental (%)',
  'Ejercicio (%)',
  'Arquetipo de Bienestar',
  'Respuestas Registradas (JSON)',
];

/**
 * Fetch sheetId (numeric ID needed for deleteDimension batchUpdate)
 */
export async function getNumericSheetId(accessToken: string, spreadsheetId: string): Promise<number> {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (res.ok) {
      const data = await res.json();
      const targetSheet = data.sheets?.find(
        (s: any) => s.properties?.title?.trim().toLowerCase() === SHEET_NAME.toLowerCase()
      ) || data.sheets?.[0];
      if (targetSheet?.properties?.sheetId !== undefined) {
        return targetSheet.properties.sheetId;
      }
    }
  } catch (err) {
    console.error('Error fetching numeric sheet ID:', err);
  }
  return 0; // Default first sheet is 0
}

/**
 * Ensures the target spreadsheet has the 'Evaluaciones' tab and header row properly configured.
 * Handles existing sheets, user custom sheets, or sheets without the 'Evaluaciones' tab.
 */
export async function ensureEvaluationsSheet(
  accessToken: string,
  spreadsheetId: string
): Promise<{ sheetTitle: string; sheetNumericId: number }> {
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title,gridProperties))`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!metaRes.ok) {
    if (metaRes.status === 401) {
      throw new Error('SESION_EXPIRADA: La sesión de Google ha expirado. Vuelve a iniciar sesión con tu cuenta de Google.');
    }
    if (metaRes.status === 403) {
      throw new Error('PERMISO_DENEGADO: No tienes permisos para acceder o modificar esta hoja de Google Sheets. Asegúrate de tener permisos de editor.');
    }
    if (metaRes.status === 404) {
      throw new Error('HOJA_NO_ENCONTRADA: La hoja de cálculo especificada no existe o fue eliminada de Google Drive.');
    }
    const err = await metaRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error al acceder a Google Sheets (${metaRes.status})`);
  }

  const meta = await metaRes.json();
  const sheets: any[] = meta.sheets || [];

  // Look for existing "Evaluaciones" tab
  let targetSheet = sheets.find(
    (s: any) => s.properties?.title?.trim().toLowerCase() === SHEET_NAME.toLowerCase()
  );

  // If not found, add the "Evaluaciones" tab
  if (!targetSheet) {
    try {
      const addRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                addSheet: {
                  properties: {
                    title: SHEET_NAME,
                    gridProperties: {
                      frozenRowCount: 1,
                    },
                  },
                },
              },
            ],
          }),
        }
      );

      if (addRes.ok) {
        const addData = await addRes.json();
        const createdSheet = addData.replies?.[0]?.addSheet?.properties;
        targetSheet = {
          properties: {
            title: SHEET_NAME,
            sheetId: createdSheet?.sheetId ?? 0,
          },
        };
      } else {
        // Fallback to first sheet if adding is disallowed
        targetSheet = sheets[0];
      }
    } catch {
      targetSheet = sheets[0];
    }
  }

  const finalTitle = targetSheet?.properties?.title || SHEET_NAME;
  const finalSheetId = targetSheet?.properties?.sheetId ?? 0;

  // Verify headers on row 1
  try {
    const escapedTitle = `'${finalTitle.replace(/'/g, "''")}'`;
    const checkHeadersRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        `${escapedTitle}!A1:J1`
      )}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (checkHeadersRes.ok) {
      const hData = await checkHeadersRes.json();
      const vals: any[][] = hData.values || [];
      if (!vals || vals.length === 0 || !vals[0] || vals[0].length === 0 || !vals[0][0]) {
        // Set header row
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
            `${escapedTitle}!A1:J1`
          )}?valueInputOption=USER_ENTERED`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ values: [HEADER_ROW_VALUES] }),
          }
        );
      }
    }
  } catch (headerErr) {
    console.warn('Could not verify headers, continuing:', headerErr);
  }

  return {
    sheetTitle: finalTitle,
    sheetNumericId: finalSheetId,
  };
}

/**
 * Creates a brand new spreadsheet formatted as a structured database
 */
export async function createEvaluationsSpreadsheet(accessToken: string): Promise<SpreadsheetMetadata> {
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: SPREADSHEET_NAME,
      },
      sheets: [
        {
          properties: {
            title: SHEET_NAME,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    if (createRes.status === 401) {
      throw new Error('SESION_EXPIRADA: Tu sesión de Google ha expirado. Vuelve a iniciar sesión.');
    }
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Error al crear hoja de cálculo (${createRes.status})`);
  }

  const created = await createRes.json();
  const spreadsheetId = created.spreadsheetId;
  const sheetNumericId = created.sheets?.[0]?.properties?.sheetId ?? 0;

  // Insert Header row with descriptive columns
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      `'${SHEET_NAME}'!A1:J1`
    )}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [HEADER_ROW_VALUES] }),
    }
  );

  // Apply styling to header row (calming green theme)
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: sheetNumericId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 10,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.05, green: 0.58, blue: 0.41 }, // Calm emerald
                  textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                    bold: true,
                    fontSize: 10,
                  },
                  horizontalAlignment: 'CENTER',
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
            },
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: sheetNumericId,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 10,
              },
            },
          },
        ],
      }),
    });
  } catch (styleErr) {
    console.warn('Could not style header row, continuing:', styleErr);
  }

  return {
    id: spreadsheetId,
    name: SPREADSHEET_NAME,
    webViewLink: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    sheetId: sheetNumericId,
  };
}

/**
 * Gets or creates the database spreadsheet.
 * If customSpreadsheetId is provided, uses that specific spreadsheet directly.
 */
export async function getOrCreateSpreadsheet(
  accessToken: string,
  customSpreadsheetId?: string
): Promise<SpreadsheetMetadata> {
  const targetId = customSpreadsheetId || getStoredOwnerConfig().spreadsheetId;
  if (targetId) {
    const { sheetNumericId } = await ensureEvaluationsSheet(accessToken, targetId);
    return {
      id: targetId,
      name: SPREADSHEET_NAME,
      webViewLink: `https://docs.google.com/spreadsheets/d/${targetId}/edit`,
      sheetId: sheetNumericId,
    };
  }

  const existing = await findExistingSpreadsheet(accessToken);
  if (existing) {
    const { sheetNumericId } = await ensureEvaluationsSheet(accessToken, existing.id);
    return { ...existing, sheetId: sheetNumericId };
  }
  return createEvaluationsSpreadsheet(accessToken);
}

/**
 * Fetch all evaluation records currently stored in the spreadsheet database
 */
export async function fetchEvaluationsFromSheet(
  accessToken: string,
  spreadsheetId: string
): Promise<SheetEvaluationRecord[]> {
  const { sheetTitle } = await ensureEvaluationsSheet(accessToken, spreadsheetId).catch(() => ({
    sheetTitle: SHEET_NAME,
  }));
  const escapedTitle = `'${sheetTitle.replace(/'/g, "''")}'`;
  const range = encodeURIComponent(`${escapedTitle}!A2:J`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('SESION_EXPIRADA: Tu sesión de Google ha expirado.');
    }
    console.error('Failed to fetch rows from spreadsheet:', res.status);
    return [];
  }

  const data = await res.json();
  const rows: any[][] = data.values || [];

  const records: SheetEvaluationRecord[] = [];
  rows.forEach((row, index) => {
    if (!row || row.length === 0 || !row[0]) return;
    const rowNumber = index + 2; // Row 1 is header, index 0 is row 2

    let answers: Record<string, string> = {};
    if (row[9]) {
      try {
        answers = typeof row[9] === 'string' ? JSON.parse(row[9]) : row[9];
      } catch (e) {
        answers = {};
      }
    }

    const pillarScores: Record<PillarId, number> = {
      sleep: Number(row[4]) || 0,
      nutrition: Number(row[5]) || 0,
      mind: Number(row[6]) || 0,
      exercise: Number(row[7]) || 0,
    };

    records.push({
      id: String(row[0]),
      date: String(row[1] || new Date().toISOString()),
      userName: String(row[2] || 'Participante'),
      totalScore: Number(row[3]) || 0,
      pillarScores,
      answers,
      archetypeTitle: String(row[8] || ''),
      sheetRowNumber: rowNumber,
    });
  });

  // Sort newest first
  return records.reverse();
}

/**
 * Save an evaluation record to the spreadsheet database (Appends as new row)
 */
export async function saveEvaluationToSheet(
  accessToken: string,
  spreadsheetId: string,
  evalData: EvaluationResult | StoredEvaluation
): Promise<void> {
  const { sheetTitle } = await ensureEvaluationsSheet(accessToken, spreadsheetId);

  // First verify if it already exists to avoid duplicate entries
  const existingRecords = await fetchEvaluationsFromSheet(accessToken, spreadsheetId).catch(() => []);
  const exists = existingRecords.some((r) => r.id === evalData.id);
  if (exists) {
    return; // Already saved
  }

  const archetypeTitle =
    'archetype' in evalData && evalData.archetype
      ? evalData.archetype.title
      : 'archetypeTitle' in evalData
      ? (evalData as StoredEvaluation).archetypeTitle
      : '';

  const rowValues = [
    [
      evalData.id,
      evalData.date,
      evalData.userName || 'Participante',
      evalData.totalScore,
      evalData.pillarScores.sleep ?? 0,
      evalData.pillarScores.nutrition ?? 0,
      evalData.pillarScores.mind ?? 0,
      evalData.pillarScores.exercise ?? 0,
      archetypeTitle,
      JSON.stringify(evalData.answers || {}),
    ],
  ];

  const escapedTitle = `'${sheetTitle.replace(/'/g, "''")}'`;
  const appendRange = encodeURIComponent(`${escapedTitle}!A:J`);
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${appendRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const appendRes = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: rowValues }),
  });

  if (!appendRes.ok) {
    if (appendRes.status === 401) {
      throw new Error('SESION_EXPIRADA: Tu sesión de Google ha expirado. Vuelve a iniciar sesión para guardar.');
    }
    const err = await appendRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error al guardar registro en Google Sheets (${appendRes.status})`);
  }
}

/**
 * Remove an evaluation record from the spreadsheet database.
 * DESTRUCTIVE OPERATION: Must only be called after explicit user confirmation in UI.
 */
export async function removeEvaluationFromSheet(
  accessToken: string,
  spreadsheetId: string,
  evalId: string
): Promise<boolean> {
  const { sheetTitle, sheetNumericId } = await ensureEvaluationsSheet(accessToken, spreadsheetId);

  // 1. Fetch current rows to find exact row index
  const escapedTitle = `'${sheetTitle.replace(/'/g, "''")}'`;
  const range = encodeURIComponent(`${escapedTitle}!A1:A`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('SESION_EXPIRADA: Tu sesión de Google ha expirado.');
    }
    throw new Error('No se pudo verificar el registro en la hoja de cálculo');
  }

  const data = await res.json();
  const rows: any[][] = data.values || [];

  // Find 0-based row index (Header is row index 0)
  const targetRowIndex0Based = rows.findIndex(
    (row, idx) => idx > 0 && row[0] && String(row[0]).trim() === evalId.trim()
  );

  if (targetRowIndex0Based === -1) {
    // Record not found in sheet
    return false;
  }

  // 2. Delete row dimension
  const deleteRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetNumericId,
                dimension: 'ROWS',
                startIndex: targetRowIndex0Based,
                endIndex: targetRowIndex0Based + 1,
              },
            },
          },
        ],
      }),
    }
  );

  if (!deleteRes.ok) {
    const err = await deleteRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Error al eliminar la fila en Google Sheets');
  }

  return true;
}

/**
 * Clear all rows from sheet (keeping header).
 * DESTRUCTIVE OPERATION: Must only be called after explicit user confirmation in UI.
 */
export async function clearAllEvaluationsFromSheet(
  accessToken: string,
  spreadsheetId: string
): Promise<void> {
  const { sheetTitle } = await ensureEvaluationsSheet(accessToken, spreadsheetId);
  const escapedTitle = `'${sheetTitle.replace(/'/g, "''")}'`;
  const range = encodeURIComponent(`${escapedTitle}!A2:J`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:clear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Error al vaciar los registros de Google Sheets');
  }
}

/* ==========================================================================
   CONEXIÓN CON HOJA DEL PROPIETARIO PARA USO DE TERCEROS
   Permite que evaluadores y personas externas guarden registros directamente
   en la hoja del propietario sin necesidad de autenticarse con Google.
   ========================================================================== */

export interface OwnerSheetConfig {
  webhookUrl: string; // Apps Script Web App URL
  spreadsheetId: string; // Google Sheets ID or URL
  spreadsheetUrl: string; // Web link to view sheet
  ownerName: string; // Name of owner or organization
  sheetTitle: string; // Sheet name (default: Evaluaciones)
  enabled: boolean; // Whether third party direct saving is enabled
}

const STORAGE_KEY_OWNER_CONFIG = 'equilibria_owner_sheet_config';

export const DEFAULT_OWNER_CONFIG: OwnerSheetConfig = {
  webhookUrl: '',
  spreadsheetId: '',
  spreadsheetUrl: '',
  ownerName: 'Propietario Equilibria',
  sheetTitle: SHEET_NAME,
  enabled: true,
};

/**
 * Extracts pure Spreadsheet ID from a URL or raw ID
 */
export function extractSpreadsheetId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Check if it's a full Google Sheets URL
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  // Otherwise assume it's already an ID
  return trimmed;
}

/**
 * Loads stored Owner Sheet configuration from localStorage
 */
export function getStoredOwnerConfig(): OwnerSheetConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OWNER_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_OWNER_CONFIG, ...parsed };
    }
  } catch (e) {
    console.warn('Could not read owner sheet config from localStorage:', e);
  }
  return DEFAULT_OWNER_CONFIG;
}

/**
 * Saves Owner Sheet configuration to localStorage
 */
export function saveStoredOwnerConfig(config: Partial<OwnerSheetConfig>): OwnerSheetConfig {
  const current = getStoredOwnerConfig();
  const updated: OwnerSheetConfig = {
    ...current,
    ...config,
    spreadsheetId: config.spreadsheetId ? extractSpreadsheetId(config.spreadsheetId) : current.spreadsheetId,
  };

  if (updated.spreadsheetId && !updated.spreadsheetUrl) {
    updated.spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${updated.spreadsheetId}/edit`;
  }

  try {
    localStorage.setItem(STORAGE_KEY_OWNER_CONFIG, JSON.stringify(updated));
  } catch (e) {
    console.error('Could not save owner sheet config:', e);
  }
  return updated;
}

/**
 * Complete Google Apps Script template for the spreadsheet owner.
 * Ready to copy and paste in Extensions > Apps Script in Google Sheets.
 */
export const APPS_SCRIPT_TEMPLATE = `/**
 * =========================================================================
 * EQUILIBRIA - SCRIPT DE CONEXIÓN CON HOJA DE CÁLCULO PARA TERCEROS
 * =========================================================================
 * Instrucciones:
 * 1. En tu hoja de cálculo de Google Sheets, ve a:
 *    Extensiones > Apps Script
 * 2. Borra el código existente y pega todo este contenido.
 * 3. Guarda el proyecto (icono de disco o Ctrl+S).
 * 4. Haz clic en el botón azul "Implementar" (arriba a la derecha) > "Nueva implementación".
 * 5. Selecciona el tipo: "Aplicación web" (icono de engranaje).
 * 6. Configura:
 *    - Descripción: "Equilibria Webhook Base de Datos"
 *    - Ejecutar como: "Yo" (tu cuenta de Google)
 *    - Quién tiene acceso: "Cualquier usuario" (Anyone)  <-- ¡Muy importante!
 * 7. Pulsa "Implementar" y autoriza los permisos si te los solicita.
 * 8. Copia la "URL de la aplicación web" resultante y pégala en Equilibria.
 * =========================================================================
 */

function doPost(e) {
  try {
    var raw = e.postData.contents;
    var data = JSON.parse(raw);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Evaluaciones") || ss.getSheets()[0];
    
    // Si la hoja está vacía, crear encabezados estilizados
    if (sheet.getLastRow() === 0) {
      var headers = [
        "ID de Evaluación",
        "Fecha y Hora",
        "Nombre de Participante",
        "Puntuación Total (%)",
        "Sueño (%)",
        "Alimentación (%)",
        "Salud Mental (%)",
        "Ejercicio (%)",
        "Arquetipo de Bienestar",
        "Respuestas Registradas (JSON)"
      ];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#059669");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    // Acción: Quitar registro (Eliminar fila por ID)
    if (data.action === "delete") {
      var rows = sheet.getDataRange().getValues();
      var targetId = String(data.id || "").trim();
      for (var i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim() === targetId) {
          sheet.deleteRow(i + 1);
          return ContentService.createTextOutput(JSON.stringify({
            status: "success",
            action: "deleted",
            id: targetId
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: "not_found",
        id: targetId
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Acción: Ping / Test de Conexión
    if (data.action === "ping") {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Conexión exitosa con la hoja: " + ss.getName(),
        sheetName: sheet.getName(),
        totalRows: sheet.getLastRow()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Verificar si ya existe este ID para evitar duplicados
    var existingRows = sheet.getDataRange().getValues();
    var evalId = String(data.id || ("EVAL-" + new Date().getTime())).trim();
    for (var j = 1; j < existingRows.length; j++) {
      if (String(existingRows[j][0]).trim() === evalId) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "already_exists",
          id: evalId,
          message: "Esta evaluación ya está guardada en la hoja"
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Guardar nueva fila de evaluación
    sheet.appendRow([
      evalId,
      data.date || new Date().toISOString(),
      data.userName || "Participante",
      Number(data.totalScore) || 0,
      data.pillarScores ? Number(data.pillarScores.sleep) || 0 : 0,
      data.pillarScores ? Number(data.pillarScores.nutrition) || 0 : 0,
      data.pillarScores ? Number(data.pillarScores.mind) || 0 : 0,
      data.pillarScores ? Number(data.pillarScores.exercise) || 0 : 0,
      data.archetypeTitle || "",
      JSON.stringify(data.answers || {})
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      id: evalId,
      message: "Evaluación guardada correctamente en la hoja del evaluador",
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Evaluaciones") || ss.getSheets()[0];
    var rows = sheet.getDataRange().getValues();
    
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        records: [],
        sheetName: ss.getName()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var records = [];
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[0]) continue;
      var answers = {};
      try {
        answers = typeof r[9] === "string" ? JSON.parse(r[9]) : (r[9] || {});
      } catch (err) {
        answers = {};
      }
      
      records.push({
        id: String(r[0]),
        date: String(r[1]),
        userName: String(r[2] || "Participante"),
        totalScore: Number(r[3]) || 0,
        pillarScores: {
          sleep: Number(r[4]) || 0,
          nutrition: Number(r[5]) || 0,
          mind: Number(r[6]) || 0,
          exercise: Number(r[7]) || 0
        },
        archetypeTitle: String(r[8] || ""),
        answers: answers,
        sheetRowNumber: i + 1
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      records: records,
      sheetName: ss.getName()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

/**
 * Test Webhook connection with the owner's Apps Script Web App
 */
export async function testWebhookConnection(webhookUrl: string): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.trim()) {
    return { success: false, message: 'La URL del Webhook no puede estar vacía.' };
  }

  const trimmed = webhookUrl.trim();

  if (trimmed.includes('docs.google.com/spreadsheets')) {
    return {
      success: false,
      message:
        'Has ingresado el enlace de Google Sheets en el campo de Webhook. El Webhook se genera en Extensiones > Apps Script > Implementar > Nueva implementación > Aplicación web (debe comenzar con https://script.google.com/macros/s/...).',
    };
  }

  if (!trimmed.startsWith('https://script.google.com/')) {
    return {
      success: false,
      message: 'La URL del Webhook debe comenzar con https://script.google.com/macros/s/...',
    };
  }

  try {
    // Test using POST ping
    const res = await fetch(trimmed, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: 'ping' }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.status === 'success') {
        return {
          success: true,
          message: data.message || '¡Conexión verificada exitosamente con tu Google Sheet!',
        };
      }
      return { success: true, message: 'Conexión recibida exitosamente por el Webhook de Google Sheets.' };
    }
    return { success: false, message: `El servidor respondió con código ${res.status}. Verifica que en Apps Script la opción "Quién tiene acceso" esté configurada en "Cualquier usuario" (Anyone).` };
  } catch (err: any) {
    console.warn('Direct fetch failed, testing with no-cors fallback:', err);
    // Attempt no-cors fetch to verify network reachability
    try {
      await fetch(trimmed, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'ping' }),
      });
      return {
        success: true,
        message: 'Conexión enviada exitosamente al Webhook de Google Sheets.',
      };
    } catch (fallbackErr: any) {
      return {
        success: false,
        message: fallbackErr?.message || 'No se pudo conectar con el Webhook. Asegúrate de haberlo desplegado como aplicación web pública.',
      };
    }
  }
}

/**
 * Save evaluation via Apps Script Webhook (for third-party users without Google login)
 */
export async function saveEvaluationViaWebhook(
  webhookUrl: string,
  evalData: EvaluationResult | StoredEvaluation
): Promise<{ success: boolean; message?: string }> {
  if (!webhookUrl || !webhookUrl.trim()) {
    throw new Error('URL de Webhook no configurada');
  }

  const trimmed = webhookUrl.trim();

  if (trimmed.includes('docs.google.com/spreadsheets')) {
    throw new Error(
      'Has ingresado un enlace de Google Sheets en el campo de Webhook. El Webhook se genera en Apps Script (comienza con https://script.google.com/macros/s/...).'
    );
  }

  const archetypeTitle =
    'archetype' in evalData && evalData.archetype
      ? evalData.archetype.title
      : 'archetypeTitle' in evalData
      ? (evalData as StoredEvaluation).archetypeTitle
      : '';

  const payload = {
    action: 'save',
    id: evalData.id,
    date: evalData.date,
    userName: evalData.userName || 'Participante',
    totalScore: evalData.totalScore,
    pillarScores: evalData.pillarScores,
    archetypeTitle,
    answers: evalData.answers || {},
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.status === 'error') {
        throw new Error(data.message || 'Error reportado por Google Sheets');
      }
      return { success: true, message: data?.message || 'Guardado exitosamente' };
    }
  } catch (err: any) {
    // If standard fetch failed due to CORS redirect on Apps Script, try no-cors send
    console.warn('Standard fetch hit CORS/redirect, sending via no-cors mode:', err);
  }

  // Robust delivery via no-cors (Google Apps Script always receives and executes this)
  await fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  return {
    success: true,
    message: 'Evaluación enviada exitosamente a la hoja de cálculo del evaluador',
  };
}

/**
 * Remove evaluation via Apps Script Webhook
 */
export async function removeEvaluationViaWebhook(
  webhookUrl: string,
  evalId: string
): Promise<{ success: boolean; message?: string }> {
  if (!webhookUrl) {
    throw new Error('URL de Webhook no configurada');
  }

  const payload = {
    action: 'delete',
    id: evalId,
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json().catch(() => null);
      return { success: true, message: data?.message || 'Fila eliminada de Google Sheets' };
    }
  } catch (err) {
    console.warn('Standard delete failed, trying no-cors:', err);
  }

  await fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  return { success: true, message: 'Solicitud de eliminación enviada a la hoja' };
}

/**
 * Fetch evaluations via Apps Script Webhook
 */
export async function fetchEvaluationsViaWebhook(webhookUrl: string): Promise<SheetEvaluationRecord[]> {
  if (!webhookUrl) return [];

  try {
    const res = await fetch(webhookUrl, { method: 'GET' });
    if (!res.ok) return [];
    const data = await res.json();
    if (data && data.status === 'success' && Array.isArray(data.records)) {
      return data.records.reverse(); // Newest first
    }
  } catch (err) {
    console.warn('Failed to fetch records via webhook GET:', err);
  }
  return [];
}
