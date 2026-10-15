import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  UserCheck,
  FileSpreadsheet,
  CheckCircle2,
  ListOrdered,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Database,
  Download,
  Trash2,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface StepByStepGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRegistration?: () => void;
}

export const StepByStepGuideModal: React.FC<StepByStepGuideModalProps> = ({
  isOpen,
  onClose,
  onStartRegistration,
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<number | 'all'>('all');

  if (!isOpen) return null;

  const isEn = language === 'en';

  const steps = [
    {
      number: '1',
      title: isEn ? 'Step 1: Register Your Name or Alias' : 'Paso 1: Registro de tu Nombre o Identificador',
      subtitle: isEn
        ? 'Personalize your assessment and final report'
        : 'Personaliza tu evaluación y reporte final',
      icon: <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: 'emerald',
      instructions: [
        isEn
          ? 'Locate the central card on the main screen (Test de Hábitos).'
          : 'En la pantalla principal, localiza la tarjeta central en «1. Tu Nombre».',
        isEn
          ? 'Type your name, alias, or evaluation code (e.g. "Diego", "Participant 01"). If left empty, "Participant" will be used by default.'
          : 'Escribe tu nombre, alias o código de participante (ej: "Diego", "María", "Participante 01"). Si lo dejas vacío, se usará "Participante" por defecto.',
        isEn
          ? 'Click «Next: Configure Storage →» or press Enter on your keyboard to continue.'
          : 'Haz clic en el botón «Siguiente: Configurar Almacenamiento →» o presiona Enter para avanzar sin iniciar bruscamente el cuestionario.',
      ],
      tip: isEn
        ? 'Your name is used exclusively to generate your personalized radar report and downloadable PDF.'
        : 'Tu nombre se utiliza para membretar tu informe técnico, radar de equilibrio y certificado PDF descargable.',
    },
    {
      number: '2',
      title: isEn
        ? 'Step 2: Activate Google Sheets Data Storage'
        : 'Paso 2: Activar el Almacenamiento en Google Sheets',
      subtitle: isEn
        ? 'Decide whether to save records to the central spreadsheet'
        : 'Decide si deseas almacenar tu evaluación en la hoja de cálculo',
      icon: <FileSpreadsheet className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      color: 'teal',
      instructions: [
        isEn
          ? 'On Step 2, you will see the interactive toggle: «Save my data to the application\'s Google Sheets storage».'
          : 'En el Paso 2 verás el selector interactivo «Guardar mis datos en el Google Sheets de la aplicación».',
        isEn
          ? 'Click anywhere on the green card to toggle auto-saving ON or OFF. A glowing checkmark confirms it is active.'
          : 'Haz clic en la tarjeta para activar o desactivar el guardado automático. La tilde verde confirma que tus resultados se registrarán.',
        isEn
          ? 'Check the connection badge: Works seamlessly for both sheet owners (OAuth) and external third-party testers (evaluator webhook without Google sign-in required).'
          : 'Verifica el estado de conexión: Funciona tanto para el propietario (Google OAuth) como para evaluados externos o terceros (mediante webhook sin necesidad de que inicien sesión).',
        isEn
          ? 'Need to edit your name? Click «← Edit Name» at any moment.'
          : '¿Deseas cambiar tu nombre? Pulsa el botón secundario «← Cambiar nombre» para regresar al Paso 1.',
      ],
      tip: isEn
        ? 'If auto-save is active, your evaluation will be saved automatically upon finishing question 16.'
        : 'Si activas el almacenamiento, tus datos se enviarán a la hoja tan pronto termines la pregunta 16.',
    },
    {
      number: '3',
      title: isEn
        ? 'Step 3: Complete the 16 Habit Questions'
        : 'Paso 3: Iniciar y Responder el Cuestionario de Hábitos',
      subtitle: isEn
        ? '16 questions across 4 scientific lifestyle pillars'
        : '16 preguntas breves en los 4 pilares fundamentales del bienestar',
      icon: <ListOrdered className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      color: 'cyan',
      instructions: [
        isEn
          ? 'Click «Start Quiz (16 Questions) →» to begin.'
          : 'Haz clic en «Comenzar Cuestionario (16 Preguntas) →» para abrir la primera pregunta.',
        isEn
          ? 'Explore the 4 pillars: 1) Sleep & Recovery, 2) Mindful Nutrition, 3) Mental Focus & Stress, 4) Daily Physical Movement (4 questions per pillar).'
          : 'Explorarás 4 pilares: 1) Sueño y Descanso, 2) Nutrición Consciente, 3) Gestión Mental y Estrés, y 4) Movimiento Diario (4 preguntas por pilar).',
        isEn
          ? 'Choose from 4 frequency options (Never/Rarely, Sometimes, Frequently, Always/Optimal).'
          : 'Elige una de las 4 opciones de frecuencia (Nunca/Rara vez = 1 pt, A veces = 2 pts, Frecuentemente = 3 pts, Siempre/Óptimo = 4 pts).',
        isEn
          ? 'Quick Shortcuts: Use keyboard keys 1, 2, 3, or 4 and press Enter to advance quickly.'
          : 'Atajos de teclado: Puedes presionar las teclas 1, 2, 3 o 4 en tu teclado y pulsar Enter para avanzar con gran agilidad.',
        isEn
          ? 'Navigate freely: Use «Previous» to review or change any past answer. Your progress is saved automatically.'
          : 'Navegación libre: Puedes pulsar «Anterior» para rectificar cualquier respuesta previa. Tu progreso no se pierde.',
      ],
      tip: isEn
        ? 'Answer honestly thinking about your typical habits over the last 30 days.'
        : 'Responde con sinceridad pensando en tu rutina típica de los últimos 30 días para obtener un diagnóstico fidedigno.',
    },
    {
      number: '4',
      title: isEn
        ? 'Step 4: Automatic Diagnostic & Data Storage'
        : 'Paso 4: Diagnóstico y Guardado Automático',
      subtitle: isEn
        ? 'Instant calculation and submission to Google Sheets'
        : 'Cálculo inmediato y transmisión segura a la hoja de cálculo',
      icon: <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      color: 'amber',
      instructions: [
        isEn
          ? 'After answering Question 16, click «View My Results».'
          : 'Al responder la pregunta 16, pulsa el botón «Ver Mis Resultados».',
        isEn
          ? 'The system computes your global vital score, percentage balance per pillar, and assigned habit archetype.'
          : 'El sistema calcula tu puntaje global, tu porcentaje de equilibrio en cada pilar y tu arquetipo de bienestar.',
        isEn
          ? 'If storage was activated in Step 2, your record is automatically written as a new row in Google Sheets with timestamp, individual pillar scores, and totals.'
          : 'Si activaste el guardado en el Paso 2, tus datos se guardan de forma instantánea como una nueva fila en Google Sheets con fecha, hora, desglose por pilar y totales.',
      ],
      tip: isEn
        ? 'A notification badge at the top of the results screen confirms: "✓ Saved to Google Sheets".'
        : 'En la pantalla de resultados verás la confirmación destacada: "✓ Guardado en Google Sheets".',
    },
    {
      number: '5',
      title: isEn
        ? 'Step 5: Total Data Control & Export Options'
        : 'Paso 5: Control Total de tus Datos y Descargas',
      subtitle: isEn
        ? 'Inspect, export to PDF, or remove your record anytime'
        : 'Visualiza, exporta en PDF o retira tu registro en cualquier momento',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: 'emerald',
      instructions: [
        isEn
          ? 'Inspect your Interactive Radar Chart and personalized habit recommendations.'
          : 'Analiza tu Gráfico de Radar de equilibrio y las recomendaciones específicas para tus pilares con mayor potencial de mejora.',
        isEn
          ? 'Export PDF or Print: Generate an official report document with your name and vital balance.'
          : 'Exportar PDF o Imprimir: Descarga tu ficha diagnóstica en formato PDF o imprímela directamente.',
        isEn
          ? 'Open Spreadsheet: Click «Open Sheet» to review the row created in Google Sheets.'
          : 'Abrir Hoja de Cálculo: Pulsa «Abrir Hoja» para consultar directamente el archivo de Google Sheets.',
        isEn
          ? 'Remove from Google Sheets: Full control over your privacy! You can click «Remove from Google Sheets» at any moment to delete your row from the database with double confirmation.'
          : 'Quitar de Google Sheets: ¡Control total de privacidad! Si deseas retirar tu registro, haz clic en «Quitar de Google Sheets» y se eliminará de la base de datos tras confirmar.',
      ],
      tip: isEn
        ? 'You have complete sovereignty over your data: save it, review it, or delete it whenever you wish.'
        : 'Soberanía total sobre tus datos: puedes guardarlos, consultarlos o quitarlos cuando tú lo decidas.',
    },
  ];

  const handleStartFromModal = () => {
    onClose();
    if (onStartRegistration) {
      onStartRegistration();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="step-guide-title"
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#101917] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden transition-all">
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-5 border-b border-stone-200 dark:border-stone-800 flex items-start sm:items-center justify-between gap-4 bg-stone-50/80 dark:bg-stone-900/40">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs ring-1 ring-emerald-600/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {isEn ? 'User Guide' : 'Guía de Uso'}
                </span>
                <span className="text-xs text-stone-400 dark:text-stone-500">
                  {isEn ? '5 Simple Steps' : '5 Pasos Sencillos'}
                </span>
              </div>
              <h2
                id="step-guide-title"
                className="text-base sm:text-lg font-bold text-stone-900 dark:text-white truncate mt-0.5"
              >
                {isEn
                  ? 'How to Register, Enable Storage & Complete the Quiz'
                  : 'Paso a Paso: Registro, Almacenamiento y Cuestionario'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
            aria-label={isEn ? 'Close guide' : 'Cerrar guía'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="px-5 sm:px-7 py-2.5 bg-stone-100/60 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {isEn ? 'All Steps (1-5)' : 'Todos los Pasos (1-5)'}
          </button>
          {steps.map((st, idx) => (
            <button
              key={st.number}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === idx
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10 text-[10px] flex items-center justify-center font-bold">
                {st.number}
              </span>
              <span>
                {idx === 0
                  ? isEn ? 'Name' : 'Nombre'
                  : idx === 1
                  ? 'Sheets'
                  : idx === 2
                  ? isEn ? 'Quiz' : 'Test'
                  : idx === 3
                  ? isEn ? 'Save' : 'Guardado'
                  : isEn ? 'Control' : 'Control'}
              </span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {steps.map((step, index) => {
            if (activeTab !== 'all' && activeTab !== index) return null;

            return (
              <div
                key={step.number}
                className="bg-white dark:bg-[#121c19] border border-stone-200/90 dark:border-stone-800/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800/60 transition-all"
              >
                {/* Step Top Bar */}
                <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <span>{step.title}</span>
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800/80 shrink-0">
                    {step.icon}
                  </div>
                </div>

                {/* Instructions List */}
                <ul className="space-y-2.5 mt-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                  {step.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                      <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>

                {/* Practical Tip Callout */}
                <div className="mt-4 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong className="font-semibold">{isEn ? 'Tip:' : 'Consejo clave:'} </strong>
                    {step.tip}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500 dark:text-stone-400 text-center sm:text-left">
            <span>
              {isEn
                ? 'Equilibria evaluates Sleep, Nutrition, Mind, and Exercise.'
                : 'Equilibria evalúa Sueño, Nutrición, Mente y Movimiento.'}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              {isEn ? 'Close' : 'Cerrar'}
            </button>
            <button
              type="button"
              onClick={handleStartFromModal}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>{isEn ? 'Got it, let\'s start!' : '¡Entendido, quiero registrarme!'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
