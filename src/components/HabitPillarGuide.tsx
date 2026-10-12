import React from 'react';
import { Moon, Apple, Brain, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HabitPillarGuideProps {
  onStartTest: () => void;
}

export const HabitPillarGuide: React.FC<HabitPillarGuideProps> = ({ onStartTest }) => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          {t('guideKicker')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          {t('guideTitle')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('guideDesc')}
        </p>
      </div>

      {/* Presentation Summary Formula Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-50 via-indigo-50 to-emerald-50 dark:from-teal-950/40 dark:via-indigo-950/30 dark:to-emerald-950/40 border border-teal-200/80 dark:border-teal-800/60 text-center space-y-2">
        <div className="text-xs font-bold uppercase tracking-widest text-teal-800 dark:text-teal-300">
          {t('guideEquationKicker')}
        </div>
        <div className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {t('formulaTitle')}
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
          {t('guideQuote')}
        </p>
      </div>

      {/* The 4 Detailed Cards */}
      <div className="space-y-6">
        {/* 1. SUEÑO / SLEEP */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {isEn ? 'Pillar 01 · The Foundation' : 'Pilar 01 · La Base de Todo'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {isEn ? 'The Power of Sleep for Body and Mind' : 'El Poder del Sueño para Cuerpo y Mente'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {isEn
                  ? 'Our body and brain need adequate time to rest and recover from daily activities.'
                  : 'Nuestro cuerpo y cerebro necesitan tiempo adecuado para descansar y recuperarse de las actividades diarias.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {isEn ? '7 to 8 Hours' : '7 a 8 Horas'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Recommended rest. Getting this proper amount gives us the vital energy to tackle tomorrow.'
                  : 'Descanso recomendado. Es el combustible vital para afrontar la siguiente jornada.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {isEn ? 'Cognitive Boost' : 'Impulso Cognitivo'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Good sleep improves our memory and helps our brain maintain focus.'
                  : 'Mejora la memoria y ayuda a mantener el enfoque mental para estudiar o trabajar.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {isEn ? 'Emotional Balance & Fatigue Prevention' : 'Equilibrio Emocional y Antifatiga'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Keeps our mood positive and prevents feeling tired or overwhelmed during work or study.'
                  : 'Mantiene un estado de ánimo positivo y previene la fatiga crónica.'}
              </p>
            </div>
          </div>
        </section>

        {/* 2. ALIMENTACIÓN / FOOD */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Apple className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {isEn ? 'Pillar 02 · Vital Fuel' : 'Pilar 02 · Nutrición Vital'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {isEn ? 'Food as Fuel: Nourishing Body & Mind' : 'La Comida como Combustible'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {isEn
                  ? 'Food acts as essential fuel for our body. Maintaining a balanced diet is critical for daily health.'
                  : 'Una dieta equilibrada basada en productos frescos y naturales fortalece el sistema inmunitario.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {isEn ? 'Clean Proteins' : 'Proteínas Limpias'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Incorporate chicken, eggs, and lean meats to nourish muscle tissues.'
                  : 'Incorpora pollo, huevos, legumbres y carnes magras para regenerar células.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {isEn ? 'Vitamins & Minerals' : 'Vitaminas & Fibra'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Eat plenty of fresh vegetables and fruits to strengthen your immune health.'
                  : 'Abundantes frutas y verduras frescas para blindar tu respuesta inmune.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {isEn ? 'Hydration & Moderation' : 'Hidratación & Moderación'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Drink plenty of water and avoid consuming too much fast food and excess sugar.'
                  : 'Mucha agua limpia; evita el exceso de comida rápida y azúcares refinados.'}
              </p>
            </div>
          </div>
        </section>

        {/* 3. SALUD MENTAL / MIND */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                {isEn ? 'Pillar 03 · Inner Calm' : 'Pilar 03 · Calma Interior'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {isEn ? 'Taking Care of Our Mind' : 'Cuidando Nuestra Mente (Mindfulness)'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {isEn
                  ? 'Modern life is fast and can cause stress. We need moments to slow down.'
                  : 'La vida moderna es veloz y genera estrés; necesitamos momentos deliberados para frenar y recuperar el centro.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {isEn ? 'Simple Relaxation Habits' : 'Hábitos Simples de Relajación'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Read a good book, listen to relaxing music, and unplug from screen overload.'
                  : 'Leer un buen libro, escuchar música relajante y desconectar de la prisa digital.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {isEn ? 'Family & Friends' : 'Conexión Humana'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Spend time with family and friends. Warm connection is emotional medicine.'
                  : 'Compartir tiempo de calidad con familia y amigos cercanos es medicina afectiva.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {isEn ? 'A Calm Mind' : 'Mente en Calma'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Manage daily problems with a positive attitude: helps us stay focused and happy.'
                  : 'Afrontar los problemas diarios con perspectiva y actitud constructiva.'}
              </p>
            </div>
          </div>
        </section>

        {/* 4. EJERCICIO FÍSICO / EXERCISE */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {isEn ? 'Pillar 04 · Active Movement' : 'Pilar 04 · Dinamismo Físico'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {isEn ? 'Move Your Body: Active Joy' : 'Mueve tu Cuerpo: Vitalidad & Endorfinas'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {isEn
                  ? 'Movement is essential for health. Exercise is not only the gym! Find an activity you enjoy.'
                  : '¡El movimiento no es solo el gimnasio! Elige cualquier actividad que disfrutes.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {isEn ? 'Releases Good Hormones' : 'Hormonas de la Felicidad'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Releases endorphins that make us happy and relieve anxiety naturally.'
                  : 'Libera endorfinas que elevan tu estado de ánimo y reducen la ansiedad de forma natural.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {isEn ? 'Keeps Heart Strong' : 'Corazón Fuerte'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Cardiovascular movement keeps blood flowing and protects your vitality.'
                  : 'Caminar, nadar, bailar o pedalear mantiene tu sistema cardiovascular sano y ágil.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {isEn ? 'Better Sleep at Night' : 'Sinergia con el Sueño'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Movement during the day helps us sleep deeply at night (back to our first point!).'
                  : 'El movimiento durante el día prepara tu cuerpo para el sueño profundo de la noche.'}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom CTA to start evaluation */}
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {t('readyToMeasureTitle')}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {t('readyToMeasureDesc')}
        </p>
        <button
          onClick={onStartTest}
          className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium text-sm transition-all shadow-sm"
        >
          {t('btnStartTestNow')}
        </button>
      </div>
    </div>
  );
};
