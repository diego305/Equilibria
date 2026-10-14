import { PillarId, PillarInfo, Question, EvaluationResult } from '../types/wellness';
import { Language } from '../data/translations';

export const PILLARS_ES: Record<PillarId, PillarInfo> = {
  sleep: {
    id: 'sleep',
    name: 'Sueño Reparador',
    subtitle: 'La base de tu energía y salud diaria',
    iconName: 'Moon',
    color: {
      text: 'text-sky-700 dark:text-sky-300',
      bg: 'bg-sky-50/70 dark:bg-sky-950/40',
      border: 'border-sky-200/80 dark:border-sky-800/60',
      fill: 'bg-sky-600',
      ring: 'ring-sky-500',
      badge: 'bg-sky-100/80 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200',
      chartFill: 'rgba(14, 165, 233, 0.22)',
      chartStroke: '#0284c7',
    },
    idealDescription: '7 a 8 horas de descanso continuo con desconexión previa de pantallas.',
    presentationTakeaway:
      'Dormir bien estimula la memoria y concentración, estabiliza el ánimo emocional y previene la fatiga para rendir con vitalidad.',
  },
  nutrition: {
    id: 'nutrition',
    name: 'Alimentación Consciente',
    subtitle: 'Combustible vital para cuerpo y mente',
    iconName: 'Apple',
    color: {
      text: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/40',
      border: 'border-emerald-200/80 dark:border-emerald-800/60',
      fill: 'bg-emerald-600',
      ring: 'ring-emerald-500',
      badge: 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
      chartFill: 'rgba(16, 185, 129, 0.22)',
      chartStroke: '#059669',
    },
    idealDescription: 'Dieta equilibrada con alimentos frescos, rica en proteínas, vegetales e hidratación regular.',
    presentationTakeaway:
      'Prioriza alimentos frescos y naturales, proteínas de calidad, hidratación abundante y moderación con ultraprocesados y azúcar para fortalecer tu sistema inmune.',
  },
  mind: {
    id: 'mind',
    name: 'Salud Mental & Calma',
    subtitle: 'Claridad, sosiego y equilibrio emocional',
    iconName: 'Brain',
    color: {
      text: 'text-teal-700 dark:text-teal-300',
      bg: 'bg-teal-50/70 dark:bg-teal-950/40',
      border: 'border-teal-200/80 dark:border-teal-800/60',
      fill: 'bg-teal-600',
      ring: 'ring-teal-500',
      badge: 'bg-teal-100/80 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200',
      chartFill: 'rgba(20, 184, 166, 0.22)',
      chartStroke: '#0d9488',
    },
    idealDescription: 'Pausas conscientes, lectura, música relajante y vínculos positivos con familia y amigos.',
    presentationTakeaway:
      'La vida moderna es rápida y genera estrés; regálate pausas para bajar el ritmo, nutrir tus relaciones y afrontar desafíos con serenidad y mente positiva.',
  },
  exercise: {
    id: 'exercise',
    name: 'Ejercicio & Movimiento',
    subtitle: 'Vitalidad corporal y liberación de endorfinas',
    iconName: 'Activity',
    color: {
      text: 'text-cyan-700 dark:text-cyan-300',
      bg: 'bg-cyan-50/70 dark:bg-cyan-950/40',
      border: 'border-cyan-200/80 dark:border-cyan-800/60',
      fill: 'bg-cyan-600',
      ring: 'ring-cyan-500',
      badge: 'bg-cyan-100/80 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200',
      chartFill: 'rgba(6, 182, 212, 0.22)',
      chartStroke: '#0891b2',
    },
    idealDescription: '30+ minutos diarios de movimiento agradable (caminar, bailar, deporte o entrenamiento).',
    presentationTakeaway:
      '¡El ejercicio no es solo el gimnasio! Encuentra lo que te divierta: libera endorfinas que te hacen feliz, fortalece tu corazón y te ayuda a dormir profundamente.',
  },
};

export const PILLARS_EN: Record<PillarId, PillarInfo> = {
  sleep: {
    id: 'sleep',
    name: 'Restful Sleep',
    subtitle: 'The foundation of daily health & energy',
    iconName: 'Moon',
    color: PILLARS_ES.sleep.color,
    idealDescription: '7 to 8 hours of continuous rest with screen detachment before bed.',
    presentationTakeaway:
      'Better sleep provides cognitive boost for memory and focus, emotional balance for mood stability, and fatigue prevention for vital energy.',
  },
  nutrition: {
    id: 'nutrition',
    name: 'Mindful Nutrition',
    subtitle: 'Essential fuel for body and mind',
    iconName: 'Apple',
    color: PILLARS_ES.nutrition.color,
    idealDescription: 'Balanced diet rich in fresh natural products, clean proteins, and hydration.',
    presentationTakeaway:
      'Prioritize fresh foods, clean protein (chicken, eggs, lean meats), fresh vegetables and fruits, abundant water, and moderation with fast food and sugar.',
  },
  mind: {
    id: 'mind',
    name: 'Mental Health & Mind',
    subtitle: 'Clarity, serenity, and emotional balance',
    iconName: 'Brain',
    color: PILLARS_ES.mind.color,
    idealDescription: 'Mindful pauses, reading, relaxing music, and quality time with family & friends.',
    presentationTakeaway:
      'Modern life is fast and causes stress. We need moments to slow down: relax with good books or music, nurture close friendships, and face problems with a calm mind.',
  },
  exercise: {
    id: 'exercise',
    name: 'Exercise & Movement',
    subtitle: 'Bodily health, active movement, and endorphins',
    iconName: 'Activity',
    color: PILLARS_ES.exercise.color,
    idealDescription: '30+ daily minutes of movement you enjoy (walking, dancing, cycling, or fitness).',
    presentationTakeaway:
      'Movement is essential, and exercise is not only the gym! Find what you enjoy: release endorphins to feel happy, keep your heart strong, and enjoy better sleep at night.',
  },
};

export const PILLARS = PILLARS_ES;

export function getPillars(lang: Language = 'es'): Record<PillarId, PillarInfo> {
  return lang === 'en' ? PILLARS_EN : PILLARS_ES;
}

export const QUESTIONS_ES: Question[] = [
  // --- PILAR 1: SUEÑO ---
  {
    id: 'sleep_hours',
    pillar: 'sleep',
    question: '¿Cuántas horas sueles dormir en promedio cada noche?',
    context: 'La ciencia del descanso recomienda entre 7 y 8 horas continuas para regenerar mente y cuerpo.',
    options: [
      { id: 'sh_1', label: 'Menos de 5 horas', subtext: 'Descanso muy deficitario', score: 1 },
      { id: 'sh_2', label: 'Entre 5 y 6 horas', subtext: 'A menudo me falta energía', score: 2 },
      { id: 'sh_3', label: 'Entre 7 y 8 horas', subtext: 'El rango óptimo recomendado', score: 4 },
      { id: 'sh_4', label: 'Más de 9 horas de forma irregular', subtext: 'Suelo levantarme con pesadez', score: 3 },
    ],
  },
  {
    id: 'sleep_quality',
    pillar: 'sleep',
    question: '¿Cómo te sientes al despertar por la mañana?',
    context: 'La calidad del descanso determina tu concentración y ánimo durante toda la jornada.',
    options: [
      { id: 'sq_1', label: 'Agotado/a y con pesadez', subtext: 'Siento que no descansé nada', score: 1 },
      { id: 'sq_2', label: 'Me cuesta mucho arrancar', subtext: 'Dependo de cafeína o fatiga matutina', score: 2 },
      { id: 'sq_3', label: 'Bien, con energía estable la mayoría de días', subtext: 'Recuperación adecuada', score: 3 },
      { id: 'sq_4', label: 'Renovado/a y con vitalidad para el día', subtext: 'Sueño profundo y reparador', score: 4 },
    ],
  },
  {
    id: 'sleep_screens',
    pillar: 'sleep',
    question: '¿Cómo es tu relación con pantallas (móvil, TV, ordenador) antes de dormir?',
    context: 'La luz azul retrasa la melatonina y altera los ciclos circadianos.',
    options: [
      { id: 'sc_1', label: 'Uso pantallas en la cama hasta cerrar los ojos', subtext: 'Redes sociales o vídeos hasta el último minuto', score: 1 },
      { id: 'sc_2', label: 'Las dejo justo antes de apagar la luz', subtext: 'Sin apenas tiempo de desconexión', score: 2 },
      { id: 'sc_3', label: 'Procuro dejarlas 20-30 minutos antes', subtext: 'Hago una transición tranquila', score: 3 },
      { id: 'sc_4', label: 'Desconexión total 45-60 min antes', subtext: 'Prefiero leer, escuchar música o estirar', score: 4 },
    ],
  },
  {
    id: 'sleep_regularity',
    pillar: 'sleep',
    question: '¿Mantienes horarios constantes para acostarte y levantarte?',
    context: 'La regularidad afianza el ritmo circadiano y mejora la estabilidad emocional.',
    options: [
      { id: 'sr_1', label: 'Totalmente caóticos e impredecibles', subtext: 'Cada día a una hora distinta', score: 1 },
      { id: 'sr_2', label: 'Cambian drásticamente entre semana y fin de semana', subtext: 'Diferencias de más de 3 horas', score: 2 },
      { id: 'sr_3', label: 'Bastante regulares con leves variaciones', subtext: 'Mantengo el patrón habitual', score: 3 },
      { id: 'sr_4', label: 'Muy regulares casi todos los días (incluso sábados y domingos)', subtext: 'Ritmo biológico sincronizado', score: 4 },
    ],
  },

  // --- PILAR 2: ALIMENTACIÓN ---
  {
    id: 'nutr_water',
    pillar: 'nutrition',
    question: '¿Cuánta agua pura bebes a lo largo del día?',
    context: 'La hidratación es la base celular para la digestión, claridad cognitiva y energía limpia.',
    options: [
      { id: 'nw_1', label: 'Menos de 3 vasos o casi sólo refrescos/café', subtext: 'Hidratación insuficiente', score: 1 },
      { id: 'nw_2', label: 'Aproximadamente 1 litro (4-5 vasos)', subtext: 'Solo cuando tengo sed evidente', score: 2 },
      { id: 'nw_3', label: 'Entre 1.5 y 2 litros regulares', subtext: 'Tengo una botella y bebo con frecuencia', score: 4 },
      { id: 'nw_4', label: 'Más de 2 litros de forma equilibrada', subtext: 'Excelente hábito hídrico diario', score: 4 },
    ],
  },
  {
    id: 'nutr_veggies_fruits',
    pillar: 'nutrition',
    question: '¿Con qué frecuencia incluyes frutas y verduras frescas en tus platos?',
    context: 'Aportan vitaminas, fibra prebiótica y antioxidantes que protegen tu sistema inmune.',
    options: [
      { id: 'nv_1', label: 'Rara vez o casi ninguna vez por semana', subtext: 'Casi ausentes de mi dieta', score: 1 },
      { id: 'nv_2', label: 'Solo 2 o 3 veces a la semana', subtext: 'Como acompañamiento testimonial', score: 2 },
      { id: 'nv_3', label: 'A diario en al menos una de las comidas', subtext: 'Buen hábito establecido', score: 3 },
      { id: 'nv_4', label: 'En casi todas las comidas (2 a 3 porciones variadas al día)', subtext: 'Abundante variedad y color fresco', score: 4 },
    ],
  },
  {
    id: 'nutr_proteins',
    pillar: 'nutrition',
    question: '¿Cómo incorporas fuentes de proteína de calidad (huevos, legumbres, pescado, aves o frutos secos)?',
    context: 'Las proteínas reconstruyen tejidos musculares y sostienen la sensación de saciedad y neurotransmisores.',
    options: [
      { id: 'np_1', label: 'Casi siempre como hidratos refinados o ultraprocesados', subtext: 'Escasa presencia proteica', score: 1 },
      { id: 'np_2', label: 'A veces, pero sin prestar mucha atención a la fuente', subtext: 'Consumo irregular', score: 2 },
      { id: 'np_3', label: 'En mis comidas principales de forma equilibrada', subtext: 'Aseguro fuentes nutritivas', score: 3 },
      { id: 'np_4', label: 'Consciente y variada todos los días', subtext: 'Combinación óptima según mis necesidades', score: 4 },
    ],
  },
  {
    id: 'nutr_sugar_fastfood',
    pillar: 'nutrition',
    question: '¿Con qué frecuencia consumes comida rápida, refrescos azucarados o bollería industrial?',
    context: 'El exceso de azúcar y grasas trans produce inflamación y picos de fatiga energética.',
    options: [
      { id: 'ns_1', label: 'A diario o casi todos los días', subtext: 'Forma parte habitual de mi menú', score: 1 },
      { id: 'ns_2', label: 'De 3 a 4 veces por semana', subtext: 'Frecuente recurso por prisa o antojos', score: 2 },
      { id: 'ns_3', label: 'Ocasionalmente (1 vez a la semana o fines de semana)', subtext: 'Consumo moderado y puntual', score: 3 },
      { id: 'ns_4', label: 'Muy esporádico o casi nulo', subtext: 'Priorizo comida casera y fresca', score: 4 },
    ],
  },

  // --- PILAR 3: SALUD MENTAL ---
  {
    id: 'mind_pauses',
    pillar: 'mind',
    question: '¿Te permites momentos diarios para desacelerar y respirar sin prisas?',
    context: 'Vivimos en un mundo veloz; parar unos minutos restablece el sistema nervioso parasimpático.',
    options: [
      { id: 'mp_1', label: 'Vivo en una vorágine continua sin frenar jamás', subtext: 'Siento que el tiempo nunca me alcanza', score: 1 },
      { id: 'mp_2', label: 'Rara vez me detengo conscientemente', subtext: 'Solo cuando colapso de cansancio', score: 2 },
      { id: 'mp_3', label: 'Dedico al menos 15-20 minutos al día a la calma', subtext: 'Pausa reflexiva o momento de té/paseo', score: 3 },
      { id: 'mp_4', label: 'Priorizo momentos diarios de silencio, meditación o respiración', subtext: 'Espacios sagrados de reconexión', score: 4 },
    ],
  },
  {
    id: 'mind_hobbies_music',
    pillar: 'mind',
    question: '¿Dedicas tiempo a actividades sencillas de disfrute (leer un buen libro, escuchar música relajante)?',
    context: 'Los pequeños placeres no digitales nutren la creatividad y alivian la sobrecarga mental.',
    options: [
      { id: 'mh_1', label: 'No tengo aficiones ni tiempo libre de ocio sereno', subtext: 'Solo consumo pasivo de pantalla', score: 1 },
      { id: 'mh_2', label: 'Muy poco, suelo postergarlo por obligaciones', subtext: 'Alguna vez al mes', score: 2 },
      { id: 'mh_3', label: 'Semanalmente disfruto de música, lectura o naturaleza', subtext: 'Me aporta ligereza y bienestar', score: 3 },
      { id: 'mh_4', label: 'Es un hábito diario o constante que cuido con cariño', subtext: 'Lectura, arte o música enriquecedora', score: 4 },
    ],
  },
  {
    id: 'mind_social',
    pillar: 'mind',
    question: '¿Cómo cultivas el tiempo de calidad con amigos, familia o seres queridos?',
    context: 'El afecto y la conexión humana son pilares protectores de la salud psicológica.',
    options: [
      { id: 'ms_1', label: 'Me siento aislado/a o con relaciones que me desgastan', subtext: 'Poco apoyo emocional', score: 1 },
      { id: 'ms_2', label: 'Hablamos por mensajes rápidos pero nos vemos poco', subtext: 'Conexión superficial o dispersa', score: 2 },
      { id: 'ms_3', label: 'Comparto momentos agradables y sinceros con regularidad', subtext: 'Vínculos de confianza y escucha', score: 3 },
      { id: 'ms_4', label: 'Tengo un círculo afectivo cercano y cuidamos momentos presenciales', subtext: 'Nutrición emocional compartida', score: 4 },
    ],
  },
  {
    id: 'mind_stress_attitude',
    pillar: 'mind',
    question: '¿Cómo sueles afrontar los contratiempos y problemas cotidianos?',
    context: 'Una mente en calma permite gestionar la adversidad con actitud constructiva.',
    options: [
      { id: 'ma_1', label: 'Me invaden la angustia y el pesimismo de inmediato', subtext: 'Me bloqueo con frecuencia', score: 1 },
      { id: 'ma_2', label: 'Suelo acumular tensión y luego me descargo', subtext: 'Me cuesta relativizar', score: 2 },
      { id: 'ma_3', label: 'Respiro, busco soluciones y mantengo la calma', subtext: 'Perspectiva constructiva', score: 3 },
      { id: 'ma_4', label: 'Acepto lo que no controlo y actúo con enfoque positivo', subtext: 'Resiliencia y serenidad activa', score: 4 },
    ],
  },

  // --- PILAR 4: EJERCICIO FÍSICO ---
  {
    id: 'ex_frequency',
    pillar: 'exercise',
    question: '¿Con qué frecuencia realizas actividad física o ejercicio activo?',
    context: 'El cuerpo humano está diseñado para moverse; cada minuto de actividad suma años de salud.',
    options: [
      { id: 'ef_1', label: 'Casi nada; estilo de vida mayoritariamente sedentario', subtext: 'Menos de 1 día a la semana', score: 1 },
      { id: 'ef_2', label: '1 o 2 días esporádicos cuando tengo ganas', subtext: 'Poco consistente', score: 2 },
      { id: 'ef_3', label: '3 a 4 días con regularidad (caminar a paso ligero, deporte o rutina)', subtext: 'Consistencia saludable', score: 3 },
      { id: 'ef_4', label: '4 o más días semanales integrados en mi vida', subtext: 'Cuerpo activo y entrenado', score: 4 },
    ],
  },
  {
    id: 'ex_enjoyment',
    pillar: 'exercise',
    question: '¿Disfrutas de las actividades físicas que practicas?',
    context: '¡El ejercicio no es solo el gimnasio! Encontrar lo que te gusta garantiza la adherencia duradera.',
    options: [
      { id: 'ee_1', label: 'Lo vivo como una obligación o sufrimiento pesado', subtext: 'Lo evito siempre que puedo', score: 1 },
      { id: 'ee_2', label: 'No he encontrado algo que realmente me motive', subtext: 'Empiezo y lo dejo rápido', score: 2 },
      { id: 'ee_3', label: 'Practico actividades que me resultan placenteras (bailar, caminar, bicicleta)', subtext: 'Me gusta la sensación', score: 3 },
      { id: 'ee_4', label: 'Me apasiona moverme y lo espero con entusiasmo cada día', subtext: 'Es mi momento favorito del día', score: 4 },
    ],
  },
  {
    id: 'ex_daily_movement',
    pillar: 'exercise',
    question: '¿Cómo es tu nivel de movimiento espontáneo en la rutina (escaleras, caminar, pausas activas)?',
    context: 'El movimiento no estructurado (NEAT) previene el daño del sedentarismo prolongado.',
    options: [
      { id: 'ed_1', label: 'Paso 8-10 horas continuas sentado/a sin levantarme', subtext: 'Inmovilidad prolongada', score: 1 },
      { id: 'ed_2', label: 'Hago alguna pausa si me acuerdo, pero uso siempre coche y ascensor', subtext: 'Mínimo movimiento', score: 2 },
      { id: 'ed_3', label: 'Elijo caminar trayectos cortos y uso escaleras a menudo', subtext: 'Actitud activa en lo cotidiano', score: 3 },
      { id: 'ed_4', label: 'Muy activo/a: pausas cada 60 min, suelo caminar más de 8.000 pasos', subtext: 'Dinamismo constante', score: 4 },
    ],
  },
  {
    id: 'ex_benefits_connection',
    pillar: 'exercise',
    question: '¿Sientes cómo el movimiento mejora tu humor, tu corazón y tu calidad de sueño nocturno?',
    context: 'El ejercicio libera endorfinas que te hacen feliz y sincroniza tu ciclo de descanso.',
    options: [
      { id: 'eb_1', label: 'No noto ninguna diferencia o no me muevo para notarlo', subtext: 'Desconexión cuerpo-mente', score: 1 },
      { id: 'eb_2', label: 'Sé que ayuda en teoría, pero no suelo experimentarlo', subtext: 'Falta de constancia para sentirlo', score: 2 },
      { id: 'eb_3', label: 'Claramente me siento más despejado/a y con mejor ánimo tras moverme', subtext: 'Liberación de endorfinas', score: 3 },
      { id: 'eb_4', label: 'Totalmente: duermo mejor, mi corazón es más fuerte y mi energía vuela', subtext: 'Círculo virtuoso de salud', score: 4 },
    ],
  },
];

export const QUESTIONS_EN: Question[] = [
  // --- PILLAR 1: SLEEP ---
  {
    id: 'sleep_hours',
    pillar: 'sleep',
    question: 'How many hours do you usually sleep on average each night?',
    context: 'Sleep science recommends 7 to 8 continuous hours to rejuvenate mind and body.',
    options: [
      { id: 'sh_1', label: 'Fewer than 5 hours', subtext: 'Severely deficient rest', score: 1 },
      { id: 'sh_2', label: 'Between 5 and 6 hours', subtext: 'Frequently running on low energy', score: 2 },
      { id: 'sh_3', label: 'Between 7 and 8 hours', subtext: 'Optimal recommended window', score: 4 },
      { id: 'sh_4', label: 'More than 9 irregular hours', subtext: 'Often waking up groggy', score: 3 },
    ],
  },
  {
    id: 'sleep_quality',
    pillar: 'sleep',
    question: 'How do you typically feel when waking up in the morning?',
    context: 'Rest quality drives cognitive clarity, memory, and emotional balance all day.',
    options: [
      { id: 'sq_1', label: 'Exhausted and lethargic', subtext: 'Feeling as though I didn\'t rest at all', score: 1 },
      { id: 'sq_2', label: 'Struggling hard to get going', subtext: 'Heavily reliant on caffeine', score: 2 },
      { id: 'sq_3', label: 'Good, with steady energy most days', subtext: 'Adequate physical recovery', score: 3 },
      { id: 'sq_4', label: 'Refreshed, clear-headed, and energized', subtext: 'Deep, rejuvenating sleep', score: 4 },
    ],
  },
  {
    id: 'sleep_screens',
    pillar: 'sleep',
    question: 'What is your habit with screens (phone, TV, computer) before bed?',
    context: 'Blue light suppresses melatonin release and delays natural circadian rhythms.',
    options: [
      { id: 'sc_1', label: 'Using screens in bed until closing my eyes', subtext: 'Social media or videos right until sleep', score: 1 },
      { id: 'sc_2', label: 'Putting screens down right before turning off lights', subtext: 'Minimal wind-down transition', score: 2 },
      { id: 'sc_3', label: 'Turning off screens 20-30 minutes beforehand', subtext: 'Quiet, peaceful transition', score: 3 },
      { id: 'sc_4', label: 'Screen curfew 45-60 min prior to sleep', subtext: 'Reading, relaxing music, or stretching', score: 4 },
    ],
  },
  {
    id: 'sleep_regularity',
    pillar: 'sleep',
    question: 'Do you keep consistent sleep and wake-up schedules?',
    context: 'Consistency stabilizes your biological clock and protects emotional equilibrium.',
    options: [
      { id: 'sr_1', label: 'Chaotic and unpredictable', subtext: 'Different bedtime and wake time every day', score: 1 },
      { id: 'sr_2', label: 'Shifting drastically between weekdays and weekends', subtext: 'Swings greater than 3 hours', score: 2 },
      { id: 'sr_3', label: 'Fairly consistent with minor deviations', subtext: 'Predictable baseline pattern', score: 3 },
      { id: 'sr_4', label: 'Highly consistent every day (including weekends)', subtext: 'Synchronized circadian rhythms', score: 4 },
    ],
  },

  // --- PILLAR 2: FOOD ---
  {
    id: 'nutr_water',
    pillar: 'nutrition',
    question: 'How much pure water do you drink throughout the day?',
    context: 'Cellular hydration powers digestion, mental acuity, and clean metabolic energy.',
    options: [
      { id: 'nw_1', label: 'Fewer than 3 glasses or mostly sugary sodas/coffee', subtext: 'Inadequate hydration', score: 1 },
      { id: 'nw_2', label: 'Around 1 liter (4-5 glasses)', subtext: 'Only drinking when noticeably thirsty', score: 2 },
      { id: 'nw_3', label: 'Between 1.5 and 2 liters consistently', subtext: 'Keeping a water bottle handy', score: 4 },
      { id: 'nw_4', label: '2 liters or more balanced through the day', subtext: 'Excellent daily hydration habit', score: 4 },
    ],
  },
  {
    id: 'nutr_veggies_fruits',
    pillar: 'nutrition',
    question: 'How often do you include fresh vegetables and fruits in your meals?',
    context: 'Vitamins, polyphenols, and prebiotic fiber reinforce your immune health.',
    options: [
      { id: 'nv_1', label: 'Rarely or almost never', subtext: 'Virtually absent from my diet', score: 1 },
      { id: 'nv_2', label: 'Only 2 or 3 times a week', subtext: 'Occasional side garnish', score: 2 },
      { id: 'nv_3', label: 'Daily in at least one primary meal', subtext: 'Good regular intake', score: 3 },
      { id: 'nv_4', label: 'In almost every meal (2 to 3 colorful servings per day)', subtext: 'Abundant fresh variety', score: 4 },
    ],
  },
  {
    id: 'nutr_proteins',
    pillar: 'nutrition',
    question: 'How do you include clean protein sources (eggs, legumes, fish, poultry, nuts)?',
    context: 'Proteins rebuild body tissues, optimize satiety, and synthesize neurotransmitters.',
    options: [
      { id: 'np_1', label: 'Mostly refined carbs or ultra-processed fast food', subtext: 'Very low quality protein intake', score: 1 },
      { id: 'np_2', label: 'Inconsistently without paying much attention', subtext: 'Irregular intake', score: 2 },
      { id: 'np_3', label: 'Balanced in my main daily meals', subtext: 'Consistent wholesome sources', score: 3 },
      { id: 'np_4', label: 'Mindful, diverse, and well-distributed daily', subtext: 'Optimal intake matched to my lifestyle', score: 4 },
    ],
  },
  {
    id: 'nutr_sugar_fastfood',
    pillar: 'nutrition',
    question: 'How often do you eat fast food, sugary sodas, or ultra-processed snacks?',
    context: 'Excess sugar and processed fats trigger systemic fatigue and energy crashes.',
    options: [
      { id: 'ns_1', label: 'Daily or almost every single day', subtext: 'A habitual part of my daily routine', score: 1 },
      { id: 'ns_2', label: '3 to 4 times a week', subtext: 'Frequent shortcut due to rush or cravings', score: 2 },
      { id: 'ns_3', label: 'Occasionally (once a week or weekends)', subtext: 'Moderate, intentional indulgence', score: 3 },
      { id: 'ns_4', label: 'Very rarely or practically never', subtext: 'Prioritizing fresh, home-cooked food', score: 4 },
    ],
  },

  // --- PILLAR 3: MENTAL HEALTH ---
  {
    id: 'mind_pauses',
    pillar: 'mind',
    question: 'Do you grant yourself moments each day to slow down and breathe without rushing?',
    context: 'Modern life is fast and stressful; taking intentional pauses restores nervous system balance.',
    options: [
      { id: 'mp_1', label: 'Living in non-stop rush without ever pausing', subtext: 'Feeling like time is always slipping away', score: 1 },
      { id: 'mp_2', label: 'Rarely pausing intentionally', subtext: 'Only when hitting total exhaustion', score: 2 },
      { id: 'mp_3', label: 'Devoting at least 15-20 daily minutes to calm', subtext: 'Reflective break, quiet tea, or walking', score: 3 },
      { id: 'mp_4', label: 'Prioritizing daily silent moments, meditation, or breathing', subtext: 'Sacred spaces for inner balance', score: 4 },
    ],
  },
  {
    id: 'mind_hobbies_music',
    pillar: 'mind',
    question: 'Do you spend time on simple relaxing habits (reading a good book, soothing music)?',
    context: 'Non-digital quiet pleasures nourish emotional resilience and relieve mental overload.',
    options: [
      { id: 'mh_1', label: 'No peaceful leisure hobbies at all', subtext: 'Only passive screen scrolling', score: 1 },
      { id: 'mh_2', label: 'Very little, constantly postponed for work', subtext: 'Maybe once a month', score: 2 },
      { id: 'mh_3', label: 'Enjoying music, reading, or nature weekly', subtext: 'Brings genuine lightness and peace', score: 3 },
      { id: 'mh_4', label: 'A cherished daily or regular practice', subtext: 'Enriching books, art, or relaxing tunes', score: 4 },
    ],
  },
  {
    id: 'mind_social',
    pillar: 'mind',
    question: 'How do you nurture quality time with family, friends, or loved ones?',
    context: 'Human warmth and genuine connection act as protective shields for psychological health.',
    options: [
      { id: 'ms_1', label: 'Feeling isolated or drained by tense relationships', subtext: 'Little emotional support', score: 1 },
      { id: 'ms_2', label: 'Quick text exchanges but rarely seeing each other', subtext: 'Dispersed, shallow contact', score: 2 },
      { id: 'ms_3', label: 'Regularly sharing pleasant, heartfelt moments', subtext: 'Trustworthy and supportive bonds', score: 3 },
      { id: 'ms_4', label: 'A close circle with frequent meaningful in-person time', subtext: 'Deep emotional nourishment', score: 4 },
    ],
  },
  {
    id: 'mind_stress_attitude',
    pillar: 'mind',
    question: 'How do you usually handle setbacks and daily challenges?',
    context: 'A calm mind manages life\'s difficulties with perspective and a constructive attitude.',
    options: [
      { id: 'ma_1', label: 'Immediately overwhelmed by anxiety and pessimism', subtext: 'Frequently feeling paralyzed', score: 1 },
      { id: 'ma_2', label: 'Bottling up tension until bursting out', subtext: 'Hard to put things in perspective', score: 2 },
      { id: 'ma_3', label: 'Breathing, seeking solutions, and keeping calm', subtext: 'Constructive problem solving', score: 3 },
      { id: 'ma_4', label: 'Accepting what I can\'t control and focusing positively', subtext: 'Active resilience and peace of mind', score: 4 },
    ],
  },

  // --- PILLAR 4: EXERCISE ---
  {
    id: 'ex_frequency',
    pillar: 'exercise',
    question: 'How frequently do you engage in active movement or physical exercise?',
    context: 'Movement is essential for health; every active minute adds vitality to your life.',
    options: [
      { id: 'ef_1', label: 'Almost none; predominantly sedentary lifestyle', subtext: 'Fewer than 1 day per week', score: 1 },
      { id: 'ef_2', label: '1 or 2 sporadic days when in the mood', subtext: 'Low consistency', score: 2 },
      { id: 'ef_3', label: '3 to 4 regular days (brisk walking, sports, or workouts)', subtext: 'Healthy consistency', score: 3 },
      { id: 'ef_4', label: '4 or more days seamlessly integrated into my life', subtext: 'Active, conditioned body', score: 4 },
    ],
  },
  {
    id: 'ex_enjoyment',
    pillar: 'exercise',
    question: 'Do you genuinely enjoy the physical activities you practice?',
    context: 'Exercise is not only the gym! Finding activities you like makes movement sustainable.',
    options: [
      { id: 'ee_1', label: 'Experienced as painful punishment or burden', subtext: 'Avoiding it whenever possible', score: 1 },
      { id: 'ee_2', label: 'Haven\'t found an activity that truly motivates me', subtext: 'Starting and quitting quickly', score: 2 },
      { id: 'ee_3', label: 'Practicing activities I find fun (dancing, cycling, walking)', subtext: 'Enjoying the feeling', score: 3 },
      { id: 'ee_4', label: 'Passionate about moving and eagerly looking forward to it', subtext: 'Favorite highlight of my day', score: 4 },
    ],
  },
  {
    id: 'ex_daily_movement',
    pillar: 'exercise',
    question: 'What is your spontaneous daily movement level (stairs, walking, active pauses)?',
    context: 'Non-exercise physical activity protects against the metabolic risks of prolonged sitting.',
    options: [
      { id: 'ed_1', label: 'Sitting 8-10 hours continuously without getting up', subtext: 'Prolonged immobility', score: 1 },
      { id: 'ed_2', label: 'Rare breaks; always taking cars and elevators', subtext: 'Minimal movement', score: 2 },
      { id: 'ed_3', label: 'Choosing to walk short trips and taking stairs often', subtext: 'Active everyday mindset', score: 3 },
      { id: 'ed_4', label: 'Very dynamic: movement breaks every 60m, 8,000+ daily steps', subtext: 'Continuous daily vitality', score: 4 },
    ],
  },
  {
    id: 'ex_benefits_connection',
    pillar: 'exercise',
    question: 'Do you feel how exercise boosts your mood, strengthens your heart, and improves your sleep?',
    context: 'Movement releases endorphins that make you happy and synchronizes your night sleep.',
    options: [
      { id: 'eb_1', label: 'Not noticing any difference or not moving enough to feel it', subtext: 'Body-mind disconnection', score: 1 },
      { id: 'eb_2', label: 'Knowing it helps in theory, but rarely feeling it', subtext: 'Lacking the streak to feel benefits', score: 2 },
      { id: 'eb_3', label: 'Noticeably clearer-headed and uplifted after moving', subtext: 'Natural endorphin release', score: 3 },
      { id: 'eb_4', label: 'Completely: sleeping deeper, heart is stronger, energy soaring', subtext: 'Virtuous cycle of health', score: 4 },
    ],
  },
];

export const QUESTIONS = QUESTIONS_ES;

export function getQuestions(lang: Language = 'es'): Question[] {
  return lang === 'en' ? QUESTIONS_EN : QUESTIONS_ES;
}

export const ARCHETYPES_ES = [
  {
    minScore: 85,
    title: 'Maestro del Equilibrio Vital',
    tagline: 'Armonía integral y hábitos sostenibles',
    description:
      '¡Felicitaciones! Has consolidado una sinergia ejemplar entre descanso, nutrición natural, serenidad mental y dinamismo físico. Tus cuatro pilares se apoyan mutuamente para otorgarte vitalidad y resiliencia diaria.',
    color: 'emerald',
  },
  {
    minScore: 70,
    title: 'Caminante Saludable',
    tagline: 'Sólida base de bienestar con áreas de afinamiento',
    description:
      'Cuentas con hábitos muy valiosos y un estilo de vida consciente. Atendiendo un par de detalles en tus pilares menos trabajados, alcanzarás un estado de balance pleno y energía sostenida.',
    color: 'teal',
  },
  {
    minScore: 50,
    title: 'Explorador del Bienestar',
    tagline: 'Buenos destellos con necesidad de mayor armonía',
    description:
      'Tienes intenciones y momentos de autocuidado, pero el ritmo acelerado o la falta de regularidad generan desbalances (por ejemplo, poco descanso o sobrecarga mental). Pequeños micro-ajustes marcarán una gran diferencia.',
    color: 'sky',
  },
  {
    minScore: 0,
    title: 'Despertar del Cambio',
    tagline: 'Una oportunidad perfecta para reinventar tus días',
    description:
      'Tu cuerpo y tu mente te están pidiendo una pausa amable. No se trata de cambiar todo de golpe, sino de aplicar la regla de oro: pequeños cambios diarios generan una transformación gigante.',
    color: 'slate',
  },
];

export const ARCHETYPES_EN = [
  {
    minScore: 85,
    title: 'Master of Vital Balance',
    tagline: 'Holistic harmony and sustainable habits',
    description:
      'Congratulations! You have cultivated an exemplary synergy among rest, nourishing food, mental serenity, and physical vitality. Your four pillars actively reinforce one another to supply lasting resilience.',
    color: 'emerald',
  },
  {
    minScore: 70,
    title: 'Healthy Trailblazer',
    tagline: 'Solid wellness foundation with areas for fine-tuning',
    description:
      'You demonstrate valuable health awareness and steady habits. Fine-tuning a couple of details in your lower-scoring pillars will unlock effortless vitality and balance.',
    color: 'teal',
  },
  {
    minScore: 50,
    title: 'Wellness Explorer',
    tagline: 'Promising sparks needing steadier harmony',
    description:
      'You have good self-care intentions, but modern fast-paced living or inconsistent schedules create friction (e.g. sleep debt or stress). Small micro-adjustments will make a world of difference.',
    color: 'sky',
  },
  {
    minScore: 0,
    title: 'Awakening to Change',
    tagline: 'A perfect turning point to reinvent your daily habits',
    description:
      'Your mind and body are inviting you to take a gentle breath. You don\'t have to change everything at once: remember the golden rule: small daily changes make a big difference.',
    color: 'slate',
  },
];

export const ARCHETYPES = ARCHETYPES_ES;

export function calculateEvaluation(
  answers: Record<string, string>,
  userName: string = 'Usuario',
  lang: Language = 'es'
): EvaluationResult {
  const currentQuestions = getQuestions(lang);
  const currentPillars = getPillars(lang);
  const currentArchetypes = lang === 'en' ? ARCHETYPES_EN : ARCHETYPES_ES;

  const pillarScores: Record<PillarId, number> = {
    sleep: 0,
    nutrition: 0,
    mind: 0,
    exercise: 0,
  };

  const pillarMax: Record<PillarId, number> = {
    sleep: 0,
    nutrition: 0,
    mind: 0,
    exercise: 0,
  };

  const pillarPoints: Record<PillarId, number> = {
    sleep: 0,
    nutrition: 0,
    mind: 0,
    exercise: 0,
  };

  currentQuestions.forEach((q) => {
    pillarMax[q.pillar] += 4;
    const selectedOptionId = answers[q.id];
    if (selectedOptionId) {
      const option = q.options.find((o) => o.id === selectedOptionId);
      if (option) {
        pillarPoints[q.pillar] += option.score;
      }
    }
  });

  (Object.keys(pillarScores) as PillarId[]).forEach((pid) => {
    const raw = (pillarPoints[pid] / (pillarMax[pid] || 1)) * 100;
    pillarScores[pid] = Math.round(raw);
  });

  const totalScore = Math.round(
    (pillarScores.sleep + pillarScores.nutrition + pillarScores.mind + pillarScores.exercise) / 4
  );

  const archetype =
    currentArchetypes.find((a) => totalScore >= a.minScore) || currentArchetypes[currentArchetypes.length - 1];

  const recommendations: Record<PillarId, string[]> = {
    sleep: [],
    nutrition: [],
    mind: [],
    exercise: [],
  };

  if (lang === 'en') {
    // Sleep tailored recs (EN)
    if (pillarScores.sleep >= 85) {
      recommendations.sleep.push(
        'Protect your 7 to 8-hour window consistently; it is your core biological fuel.',
        'Keep honoring your pre-bed wind-down to maintain top memory and focus.'
      );
    } else if (pillarScores.sleep >= 65) {
      recommendations.sleep.push(
        'Set a 30-minute screen curfew before bed; replace screens with a good book or relaxing music.',
        'Aim to go to bed and wake up at consistent times on weekends to anchor your circadian clock.'
      );
    } else {
      recommendations.sleep.push(
        'Prioritize 7 hours of rest as a non-negotiable health commitment.',
        'Quality sleep boosts memory, balances daily mood, and prevents constant fatigue.',
        'Avoid heavy late dinners and keep your phone away from the bedside to encourage deep sleep.'
      );
    }

    // Nutrition tailored recs (EN)
    if (pillarScores.nutrition >= 85) {
      recommendations.nutrition.push(
        'Your balanced diet of fresh whole foods acts as a protective shield for your immune system.',
        'Continue enjoying 2 liters of water and diverse colorful vegetables across daily meals.'
      );
    } else if (pillarScores.nutrition >= 65) {
      recommendations.nutrition.push(
        'Increase raw or steamed greens in main meals to maximize vitamin and fiber density.',
        'Keep a refillable water bottle close by to hydrate before thirst signals arrive.',
        'Choose clean protein (chicken, eggs, legumes, lean meats) and moderate ultra-processed items.'
      );
    } else {
      recommendations.nutrition.push(
        'Treat food as your body\'s vital fuel: fresh ingredients produce genuine daily vitality.',
        'Swap sugary drinks and sodas for clean water and herbal teas.',
        'Start simply by adding one serving of fresh fruit at breakfast and greens at dinner.'
      );
    }

    // Mind tailored recs (EN)
    if (pillarScores.mind >= 85) {
      recommendations.mind.push(
        'Your serenity and positive attitude when facing daily challenges inspire those around you.',
        'Continue reserving your cherished rituals: good books, calming music, and deep friendships.'
      );
    } else if (pillarScores.mind >= 65) {
      recommendations.mind.push(
        'Take a 10-minute afternoon pause to slow your heart rate and breathe deeply.',
        'Prioritize in-person conversations and warm moments with close family and friends.',
        'Manage setbacks with a positive mindset: focus your energy on what is within your control.'
      );
    } else {
      recommendations.mind.push(
        'Modern life moves fast; schedule dedicated pauses to slow down and recharge mental energy.',
        'Try reading a good book or listening to relaxing music before sleeping instead of scrolling social media.',
        'Share your feelings with someone you trust; connecting eases stress and brings mental clarity.'
      );
    }

    // Exercise tailored recs (EN)
    if (pillarScores.exercise >= 85) {
      recommendations.exercise.push(
        'Fantastic consistency! Regular endorphin release strengthens your heart and elevates happiness.',
        'Your active movement during the day serves as the best natural catalyst for restorative night sleep.'
      );
    } else if (pillarScores.exercise >= 65) {
      recommendations.exercise.push(
        'Remember that exercise is not only the gym! Enjoy brisk walking, dancing, swimming, or cycling.',
        'Incorporate 2-minute movement breaks to stretch if sitting for long work or study blocks.',
        'Choose stairs over elevators to steadily increase your daily non-exercise physical activity.'
      );
    } else {
      recommendations.exercise.push(
        'Movement is essential for life: starting with 15 to 20 minutes of enjoyable walking makes a massive difference.',
        'Find an activity you truly enjoy; when movement is fun, consistency becomes effortless.',
        'Notice how moving releases happiness hormones and helps you fall asleep faster at night.'
      );
    }
  } else {
    // Sleep tailored recs (ES)
    if (pillarScores.sleep >= 85) {
      recommendations.sleep.push(
        'Mantén tu ventana de descanso de 7 a 8 horas constante; es tu combustible biológico principal.',
        'Sigue protegiendo tus momentos previos de desconexión para salvaguardar tu agudeza cognitiva.'
      );
    } else if (pillarScores.sleep >= 65) {
      recommendations.sleep.push(
        'Fija un toque de queda de pantallas 30 minutos antes de dormir; sustitúyelo por lectura o música serena.',
        'Intenta acostarte y levantarte a la misma hora también los fines de semana para regular tu reloj circadiano.'
      );
    } else {
      recommendations.sleep.push(
        'Prioriza llegar a las 7 horas de descanso como compromiso no negociable con tu salud.',
        'El descanso de calidad previene la fatiga, mejora la memoria y mantiene tus emociones en equilibrio.',
        'Evita cenar pesado o usar el móvil en la cama para facilitar el descanso reparador.'
      );
    }

    // Nutrition tailored recs (ES)
    if (pillarScores.nutrition >= 85) {
      recommendations.nutrition.push(
        'Tu dieta equilibrada y rica en alimentos frescos actúa como un escudo para tu sistema inmune.',
        'Sigue asegurando los 2 litros de agua y variedad de colores vegetales en tus comidas principales.'
      );
    } else if (pillarScores.nutrition >= 65) {
      recommendations.nutrition.push(
        'Aumenta la presencia de vegetales crudos o al vapor en cada comida para maximizar vitaminas y fibra.',
        'Lleva contigo una botella de agua reutilizable para recordar beber antes de que aparezca la sed.',
        'Elige proteínas limpias (huevos, legumbres, carnes magras) y modera las comidas ultraprocesadas.'
      );
    } else {
      recommendations.nutrition.push(
        'Ve la comida como el combustible esencial de tu organismo: comida fresca = energía real.',
        'Sustituye refrescos y azúcares por agua e infusiones naturales.',
        'Comienza incorporando al menos una porción de fruta fresca en el desayuno y verduras en la cena.'
      );
    }

    // Mind tailored recs (ES)
    if (pillarScores.mind >= 85) {
      recommendations.mind.push(
        'Tu serenidad y actitud constructiva ante los desafíos cotidianos inspiran a tu entorno.',
        'Continúa reservando tus rituales de lectura, música relajante y vínculos afectivos cálidos.'
      );
    } else if (pillarScores.mind >= 65) {
      recommendations.mind.push(
        'Dedica una pausa de 10 minutos a media tarde para bajar las revoluciones y respirar profundamente.',
        'Prioriza encuentros presenciales y conversaciones enriquecedoras con amigos o familiares.',
        'Practica enfocar los contratiempos con actitud positiva: diferencia lo que depende de ti de lo que no.'
      );
    } else {
      recommendations.mind.push(
        'La vida actual va muy deprisa; necesitas momentos para desacelerar y recargar tu batería mental.',
        'Prueba a escuchar música relajante o leer un libro antes de dormir en lugar de deslizar redes sociales.',
        'Habla con alguien cercano sobre cómo te sientes; compartir aligera el estrés y despeja la mente.'
      );
    }

    // Exercise tailored recs (ES)
    if (pillarScores.exercise >= 85) {
      recommendations.exercise.push(
        '¡Excelente dinamismo! La liberación regular de endorfinas fortalece tu corazón y felicidad.',
        'Tu actividad física regular actúa como el mejor catalizador para conciliar un sueño profundo.'
      );
    } else if (pillarScores.exercise >= 65) {
      recommendations.exercise.push(
        '¡Recuerda que el ejercicio no es solo el gimnasio! Busca variedad: caminar a paso ligero, bailar o nadar.',
        'Añade micropausas activas de 2 minutos para estirar si pasas muchas horas sentado trabajando o estudiando.',
        'Aprovecha las escaleras en lugar de ascensores para elevar tu gasto energético cotidiano.'
      );
    } else {
      recommendations.exercise.push(
        'El movimiento es vida: comenzar con 15 a 20 minutos de caminata agradable diaria produce un cambio enorme.',
        'Descubre una actividad que disfrutes de verdad; si te divierte, no te costará sostenerla.',
        'Comprueba cómo moverte libera las hormonas de la felicidad y te ayuda a descansar mucho mejor de noche.'
      );
    }
  }

  // 7-day action plan: select top 3 micro-actions targeting the weakest pillars
  const sortedPillars = (Object.keys(pillarScores) as PillarId[]).sort(
    (a, b) => pillarScores[a] - pillarScores[b]
  );
  const weakest1 = sortedPillars[0];
  const weakest2 = sortedPillars[1];

  let actionPlan: string[] = [];
  if (lang === 'en') {
    actionPlan = [
      `Days 1 to 3: In ${currentPillars[weakest1].name}, focus on: "${recommendations[weakest1][0]}"`,
      `Days 4 & 5: In ${currentPillars[weakest2].name}, add: "${recommendations[weakest2][0]}"`,
      'Days 6 & 7: Remember the formula: SLEEP + FOOD + MIND + EXERCISE = BALANCE and celebrate your progress.',
    ];
  } else {
    actionPlan = [
      `Día 1 a 3: En ${currentPillars[weakest1].name}, aplica: "${recommendations[weakest1][0]}"`,
      `Día 4 y 5: En ${currentPillars[weakest2].name}, suma: "${recommendations[weakest2][0]}"`,
      'Día 6 y 7: Repasa la fórmula: SUEÑO + ALIMENTACIÓN + MENTE + EJERCICIO = EQUILIBRIO y celebra tus logros.',
    ];
  }

  const defaultUser = lang === 'en' ? 'Participant' : 'Participante';

  return {
    id: 'eval_' + Date.now(),
    date: new Date().toISOString(),
    userName: userName.trim() || defaultUser,
    answers,
    pillarScores,
    totalScore,
    archetype,
    recommendations,
    actionPlan,
  };
}
