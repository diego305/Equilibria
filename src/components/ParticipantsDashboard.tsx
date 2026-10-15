import React, { useState, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Award,
  Sparkles,
  BarChart3,
  GitCompare,
  Radar,
  Search,
  ArrowUpDown,
  Download,
  Database,
  HardDrive,
  FileSpreadsheet,
  Moon,
  Apple,
  Brain,
  Activity,
  CheckCircle2,
  ChevronRight,
  Eye,
  RefreshCw,
  Minus,
  HelpCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { PillarId, StoredEvaluation } from '../types/wellness';
import { getPillars } from '../data/wellnessData';
import { useLanguage } from '../context/LanguageContext';
import { SheetEvaluationRecord } from '../services/googleSheetsService';

export interface ParticipantRecord {
  id: string;
  userName: string;
  date: string;
  totalScore: number;
  pillarScores: Record<PillarId, number>;
  archetypeTitle: string;
  source: 'sheets' | 'local' | 'sample';
  answers?: Record<string, string>;
  sheetRowNumber?: number;
}

interface ParticipantsDashboardProps {
  storedEvaluations: StoredEvaluation[];
  sheetRecords: SheetEvaluationRecord[];
  currentEvaluation?: StoredEvaluation;
  onTakeNewTest: () => void;
  onSelectEvaluation: (evalId: string) => void;
}

const SAMPLE_PARTICIPANTS: ParticipantRecord[] = [
  {
    id: 'sample-1',
    userName: 'Elena Valenzuela',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    totalScore: 88,
    pillarScores: { sleep: 90, nutrition: 85, mind: 92, exercise: 85 },
    archetypeTitle: 'Maestro del Equilibrio',
    source: 'sample',
  },
  {
    id: 'sample-2',
    userName: 'Carlos Mendoza',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    totalScore: 78,
    pillarScores: { sleep: 65, nutrition: 80, mind: 72, exercise: 95 },
    archetypeTitle: 'Motor Activo',
    source: 'sample',
  },
  {
    id: 'sample-3',
    userName: 'Sofía Herrera',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    totalScore: 84,
    pillarScores: { sleep: 85, nutrition: 90, mind: 80, exercise: 81 },
    archetypeTitle: 'Nutrición Serena',
    source: 'sample',
  },
  {
    id: 'sample-4',
    userName: 'Lucas Roldán',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    totalScore: 58,
    pillarScores: { sleep: 52, nutrition: 55, mind: 75, exercise: 50 },
    archetypeTitle: 'Explorador Consciente',
    source: 'sample',
  },
  {
    id: 'sample-5',
    userName: 'Mariana Castro',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    totalScore: 68,
    pillarScores: { sleep: 70, nutrition: 65, mind: 68, exercise: 69 },
    archetypeTitle: 'Buscador de Rutinas',
    source: 'sample',
  },
  {
    id: 'sample-6',
    userName: 'Diego Andrada',
    date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    totalScore: 81,
    pillarScores: { sleep: 78, nutrition: 75, mind: 85, exercise: 86 },
    archetypeTitle: 'Guerrero Vital',
    source: 'sample',
  },
];

const PALETTE = [
  { stroke: '#059669', fill: 'rgba(5, 150, 105, 0.25)', label: 'Emerald' },
  { stroke: '#4f46e5', fill: 'rgba(79, 70, 229, 0.25)', label: 'Indigo' },
  { stroke: '#d97706', fill: 'rgba(217, 119, 6, 0.25)', label: 'Amber' },
  { stroke: '#e11d48', fill: 'rgba(225, 29, 72, 0.25)', label: 'Rose' },
  { stroke: '#0891b2', fill: 'rgba(8, 145, 178, 0.25)', label: 'Cyan' },
];

export const ParticipantsDashboard: React.FC<ParticipantsDashboardProps> = ({
  storedEvaluations,
  sheetRecords,
  currentEvaluation,
  onTakeNewTest,
  onSelectEvaluation,
}) => {
  const { language, t } = useLanguage();
  const pillars = getPillars(language);
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState<'table' | 'radar' | 'pillars' | '1v1'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'sheets' | 'local' | 'sample'>('all');
  const [sortBy, setSortBy] = useState<
    'totalDesc' | 'totalAsc' | 'dateDesc' | 'nameAsc' | 'sleep' | 'nutrition' | 'mind' | 'exercise'
  >('totalDesc');
  const [useSampleData, setUseSampleData] = useState(false);

  // Combine and deduplicate participants
  const participants = useMemo(() => {
    const list: ParticipantRecord[] = [];
    const seenIds = new Set<string>();

    // 1. Google Sheets records (if any)
    sheetRecords.forEach((sr) => {
      if (!seenIds.has(sr.id)) {
        seenIds.add(sr.id);
        list.push({
          id: sr.id,
          userName: sr.userName || (isEn ? 'Participant' : 'Participante'),
          date: sr.date,
          totalScore: sr.totalScore,
          pillarScores: sr.pillarScores,
          archetypeTitle: sr.archetypeTitle,
          source: 'sheets',
          answers: sr.answers,
          sheetRowNumber: sr.sheetRowNumber,
        });
      }
    });

    // 2. Current active test (if finished)
    if (currentEvaluation && !seenIds.has(currentEvaluation.id)) {
      seenIds.add(currentEvaluation.id);
      list.push({
        id: currentEvaluation.id,
        userName: currentEvaluation.userName || (isEn ? 'Participant (Current)' : 'Participante (Actual)'),
        date: currentEvaluation.date,
        totalScore: currentEvaluation.totalScore,
        pillarScores: currentEvaluation.pillarScores,
        archetypeTitle: currentEvaluation.archetypeTitle,
        source: 'local',
        answers: currentEvaluation.answers,
      });
    }

    // 3. Local stored evaluations
    storedEvaluations.forEach((se) => {
      if (!seenIds.has(se.id)) {
        seenIds.add(se.id);
        list.push({
          id: se.id,
          userName: se.userName || (isEn ? 'Participant' : 'Participante'),
          date: se.date,
          totalScore: se.totalScore,
          pillarScores: se.pillarScores,
          archetypeTitle: se.archetypeTitle,
          source: 'local',
          answers: se.answers,
        });
      }
    });

    // 4. Sample data if toggled or if list is empty
    if (useSampleData) {
      SAMPLE_PARTICIPANTS.forEach((sp) => {
        if (!seenIds.has(sp.id)) {
          seenIds.add(sp.id);
          list.push(sp);
        }
      });
    }

    return list;
  }, [sheetRecords, storedEvaluations, currentEvaluation, useSampleData, isEn]);

  // Selected participant IDs for Multi-Radar (up to 4)
  const [selectedRadarIds, setSelectedRadarIds] = useState<string[]>(() => {
    return participants.slice(0, 3).map((p) => p.id);
  });

  // Selected participants for 1-on-1 comparison
  const [oneOnOneAId, setOneOnOneAId] = useState<string>('');
  const [oneOnOneBId, setOneOnOneBId] = useState<string>('');

  // Update defaults when participants change
  useMemo(() => {
    if (participants.length > 0) {
      if (!oneOnOneAId || !participants.some((p) => p.id === oneOnOneAId)) {
        setOneOnOneAId(participants[0].id);
      }
      if (!oneOnOneBId || !participants.some((p) => p.id === oneOnOneBId)) {
        setOneOnOneBId(participants[1]?.id || participants[0].id);
      }
      if (selectedRadarIds.length === 0) {
        setSelectedRadarIds(participants.slice(0, 3).map((p) => p.id));
      }
    }
  }, [participants]);

  // Aggregate Metrics & KPIs
  const metrics = useMemo(() => {
    if (participants.length === 0) {
      return {
        total: 0,
        avgTotal: 0,
        pillarAverages: { sleep: 0, nutrition: 0, mind: 0, exercise: 0 },
        bestPillar: null as { id: PillarId; name: string; score: number } | null,
        lowestPillar: null as { id: PillarId; name: string; score: number } | null,
        optimalCount: 0,
        optimalPct: 0,
        topPerformer: null as ParticipantRecord | null,
      };
    }

    const total = participants.length;
    const sumTotal = participants.reduce((acc, p) => acc + p.totalScore, 0);
    const avgTotal = Math.round(sumTotal / total);

    const pillarSums: Record<PillarId, number> = { sleep: 0, nutrition: 0, mind: 0, exercise: 0 };
    participants.forEach((p) => {
      pillarSums.sleep += p.pillarScores.sleep || 0;
      pillarSums.nutrition += p.pillarScores.nutrition || 0;
      pillarSums.mind += p.pillarScores.mind || 0;
      pillarSums.exercise += p.pillarScores.exercise || 0;
    });

    const pillarAverages: Record<PillarId, number> = {
      sleep: Math.round(pillarSums.sleep / total),
      nutrition: Math.round(pillarSums.nutrition / total),
      mind: Math.round(pillarSums.mind / total),
      exercise: Math.round(pillarSums.exercise / total),
    };

    const pillarEntries = (['sleep', 'nutrition', 'mind', 'exercise'] as PillarId[]).map((id) => {
      const pInfo = pillars[id];
      return {
        id,
        name: pInfo?.name || id,
        score: pillarAverages[id],
      };
    });

    pillarEntries.sort((a, b) => b.score - a.score);
    const bestPillar = pillarEntries[0];
    const lowestPillar = pillarEntries[pillarEntries.length - 1];

    const optimalCount = participants.filter((p) => p.totalScore >= 80).length;
    const optimalPct = Math.round((optimalCount / total) * 100);

    const sortedByTotal = [...participants].sort((a, b) => b.totalScore - a.totalScore);
    const topPerformer = sortedByTotal[0] || null;

    return {
      total,
      avgTotal,
      pillarAverages,
      bestPillar,
      lowestPillar,
      optimalCount,
      optimalPct,
      topPerformer,
    };
  }, [participants, pillars]);

  // Filtered & Sorted participants for the Table
  const filteredParticipants = useMemo(() => {
    let result = [...participants];

    // Filter by source
    if (sourceFilter !== 'all') {
      result = result.filter((p) => p.source === sourceFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.userName.toLowerCase().includes(q) ||
          p.archetypeTitle.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'totalDesc':
          return b.totalScore - a.totalScore;
        case 'totalAsc':
          return a.totalScore - b.totalScore;
        case 'dateDesc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'nameAsc':
          return a.userName.localeCompare(b.userName);
        case 'sleep':
          return (b.pillarScores.sleep || 0) - (a.pillarScores.sleep || 0);
        case 'nutrition':
          return (b.pillarScores.nutrition || 0) - (a.pillarScores.nutrition || 0);
        case 'mind':
          return (b.pillarScores.mind || 0) - (a.pillarScores.mind || 0);
        case 'exercise':
          return (b.pillarScores.exercise || 0) - (a.pillarScores.exercise || 0);
        default:
          return b.totalScore - a.totalScore;
      }
    });

    return result;
  }, [participants, sourceFilter, searchQuery, sortBy]);

  // Export to CSV
  const handleExportCsv = () => {
    if (participants.length === 0) return;

    const headers = [
      isEn ? 'Rank' : 'Posicion',
      isEn ? 'Participant' : 'Participante',
      isEn ? 'Date' : 'Fecha',
      isEn ? 'Overall Score (%)' : 'Puntaje Global (%)',
      isEn ? 'Sleep (%)' : 'Sueno (%)',
      isEn ? 'Nutrition (%)' : 'Nutricion (%)',
      isEn ? 'Mind (%)' : 'Salud Mental (%)',
      isEn ? 'Exercise (%)' : 'Ejercicio (%)',
      isEn ? 'Archetype' : 'Arquetipo',
      isEn ? 'Source' : 'Origen',
    ];

    const sortedForExport = [...participants].sort((a, b) => b.totalScore - a.totalScore);
    const rows = sortedForExport.map((p, index) => [
      index + 1,
      `"${p.userName.replace(/"/g, '""')}"`,
      new Date(p.date).toLocaleDateString(),
      p.totalScore,
      p.pillarScores.sleep || 0,
      p.pillarScores.nutrition || 0,
      p.pillarScores.mind || 0,
      p.pillarScores.exercise || 0,
      `"${p.archetypeTitle.replace(/"/g, '""')}"`,
      p.source === 'sheets' ? 'Google Sheets' : p.source === 'local' ? 'Local' : 'Sample',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Equilibria_Dashboard_Participantes_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper for performance badge
  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return {
        label: isEn ? 'Optimal' : 'Óptimo',
        bg: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      };
    }
    if (score >= 65) {
      return {
        label: isEn ? 'Favorable' : 'Favorable',
        bg: 'bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      };
    }
    if (score >= 50) {
      return {
        label: isEn ? 'Moderate' : 'Moderado',
        bg: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      };
    }
    return {
      label: isEn ? 'Needs Focus' : 'Atención',
      bg: 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    };
  };

  // Multi-Radar SVG Calculations
  const radarAxes: { id: PillarId; angleDeg: number; name: string }[] = [
    { id: 'sleep', angleDeg: 270, name: pillars.sleep?.name || 'Sueño' },
    { id: 'nutrition', angleDeg: 0, name: pillars.nutrition?.name || 'Nutrición' },
    { id: 'exercise', angleDeg: 90, name: pillars.exercise?.name || 'Movimiento' },
    { id: 'mind', angleDeg: 180, name: pillars.mind?.name || 'Mente' },
  ];

  const radarSize = 340;
  const radarCenter = radarSize / 2;
  const radarRadius = radarSize * 0.38;

  const polarToCartesian = (score: number, angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (score / 100) * radarRadius;
    const x = radarCenter + r * Math.cos(angleRad);
    const y = radarCenter + r * Math.sin(angleRad);
    return { x, y };
  };

  const getPolygonPoints = (scores: Record<PillarId, number>) => {
    return radarAxes
      .map((axis) => {
        const pt = polarToCartesian(scores[axis.id] ?? 0, axis.angleDeg);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');
  };

  const baselinePoints = radarAxes
    .map((axis) => {
      const pt = polarToCartesian(80, axis.angleDeg);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  const toggleRadarParticipant = (id: string) => {
    if (selectedRadarIds.includes(id)) {
      if (selectedRadarIds.length > 1) {
        setSelectedRadarIds(selectedRadarIds.filter((item) => item !== id));
      }
    } else {
      if (selectedRadarIds.length < 4) {
        setSelectedRadarIds([...selectedRadarIds, id]);
      } else {
        // Replace last
        setSelectedRadarIds([...selectedRadarIds.slice(1), id]);
      }
    }
  };

  // 1-on-1 comparison records
  const eval1v1A = participants.find((p) => p.id === oneOnOneAId) || participants[0];
  const eval1v1B = participants.find((p) => p.id === oneOnOneBId) || participants[1] || participants[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              {t('dashKicker')}
            </span>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
              {metrics.total} {isEn ? 'participants analyzed' : 'participantes analizados'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white mt-1">
            {t('dashTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            {t('dashSubtitle')}
          </p>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sample Data Toggle Button */}
          <button
            type="button"
            onClick={() => setUseSampleData(!useSampleData)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
              useSampleData
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                : 'bg-white dark:bg-[#101917] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
            title={isEn ? 'Toggle demo sample data' : 'Alternar datos de muestra de ejemplo'}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{useSampleData ? t('dashBtnClearSample') : t('dashBtnLoadSample')}</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={participants.length === 0}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-[#101917] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('dashBtnExportCsv')}</span>
          </button>

          {/* New Test Action */}
          <button
            type="button"
            onClick={onTakeNewTest}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('btnNewTest')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* KPI 1: Total Participants */}
        <div className="bg-white dark:bg-[#101917] rounded-2xl p-4 sm:p-5 border border-stone-200/80 dark:border-stone-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-xs font-medium">{t('dashKpiTotal')}</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tabular-nums">
              {metrics.total}
            </span>
            <span className="text-[11px] text-stone-400 font-mono">
              {sheetRecords.length > 0 ? `${sheetRecords.length} en Sheets` : 'registros'}
            </span>
          </div>
        </div>

        {/* KPI 2: Group Average */}
        <div className="bg-white dark:bg-[#101917] rounded-2xl p-4 sm:p-5 border border-stone-200/80 dark:border-stone-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-xs font-medium">{t('dashKpiAvg')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tabular-nums">
              {metrics.avgTotal}%
            </span>
            <span
              className={`text-[11px] font-semibold ${
                metrics.avgTotal >= 80
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : metrics.avgTotal >= 65
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {metrics.avgTotal >= 80 ? '✓ Óptimo' : metrics.avgTotal >= 65 ? 'Favorable' : 'Mejorable'}
            </span>
          </div>
        </div>

        {/* KPI 3: Best Performing Pillar */}
        <div className="bg-white dark:bg-[#101917] rounded-2xl p-4 sm:p-5 border border-stone-200/80 dark:border-stone-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-xs font-medium">{t('dashKpiBestPillar')}</span>
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-bold text-stone-900 dark:text-white block truncate">
              {metrics.bestPillar?.name || '—'}
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {metrics.bestPillar ? `${metrics.bestPillar.score}% promedio` : '—'}
            </span>
          </div>
        </div>

        {/* KPI 4: Lowest / Challenge Pillar */}
        <div className="bg-white dark:bg-[#101917] rounded-2xl p-4 sm:p-5 border border-stone-200/80 dark:border-stone-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-xs font-medium">{t('dashKpiNeedWork')}</span>
            <TrendingDown className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-bold text-stone-900 dark:text-white block truncate">
              {metrics.lowestPillar?.name || '—'}
            </span>
            <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
              {metrics.lowestPillar ? `${metrics.lowestPillar.score}% promedio` : '—'}
            </span>
          </div>
        </div>

        {/* KPI 5: Meeting Healthy Goal */}
        <div className="col-span-2 lg:col-span-1 bg-white dark:bg-[#101917] rounded-2xl p-4 sm:p-5 border border-stone-200/80 dark:border-stone-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-xs font-medium">{t('dashKpiOptimalPct')}</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tabular-nums">
              {metrics.optimalPct}%
            </span>
            <span className="text-[11px] text-stone-400">
              ({metrics.optimalCount}/{metrics.total})
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-stone-200 dark:border-stone-800 overflow-x-auto scrollbar-none pb-px text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => setActiveTab('table')}
          className={`px-3.5 sm:px-4 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'table'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300 font-semibold'
              : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('dashTabTable')}</span>
          <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono">
            {filteredParticipants.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('radar')}
          className={`px-3.5 sm:px-4 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'radar'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300 font-semibold'
              : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Radar className="w-4 h-4" />
          <span>{t('dashTabMultiRadar')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pillars')}
          className={`px-3.5 sm:px-4 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'pillars'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300 font-semibold'
              : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t('dashTabPillars')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('1v1')}
          className={`px-3.5 sm:px-4 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === '1v1'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300 font-semibold'
              : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span>{t('dashTabFaceToFace')}</span>
        </button>
      </div>

      {/* Empty State Warning if No Data */}
      {participants.length === 0 && (
        <div className="bg-white dark:bg-[#101917] rounded-3xl p-8 sm:p-12 border border-stone-200 dark:border-stone-800 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            {t('dashNoDataTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            {t('dashNoDataDesc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setUseSampleData(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('dashBtnLoadSample')}</span>
            </button>
            <button
              type="button"
              onClick={onTakeNewTest}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              {t('dashBtnTakeQuiz')}
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: Ranking & Leaderboard Table */}
      {participants.length > 0 && activeTab === 'table' && (
        <div className="space-y-4">
          {/* Filters & Search Toolbar */}
          <div className="bg-white dark:bg-[#101917] rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('dashSearch')}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Filter by Source & Sort Controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Source Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 hidden sm:inline">{t('dashFilterSource')}:</span>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as any)}
                  className="px-2.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">{t('dashSourceAll')}</option>
                  <option value="sheets">{t('dashSourceSheets')}</option>
                  <option value="local">{t('dashSourceLocal')}</option>
                  {useSampleData && <option value="sample">{t('dashSourceSample')}</option>}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 hidden sm:inline" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="totalDesc">{t('dashSortTotalDesc')}</option>
                  <option value="totalAsc">{t('dashSortTotalAsc')}</option>
                  <option value="dateDesc">{t('dashSortDate')}</option>
                  <option value="nameAsc">{t('dashSortName')}</option>
                  <option value="sleep">🌙 {isEn ? 'Best in Sleep' : 'Mejor en Sueño'}</option>
                  <option value="nutrition">🍎 {isEn ? 'Best in Nutrition' : 'Mejor en Nutrición'}</option>
                  <option value="mind">🧠 {isEn ? 'Best in Mind' : 'Mejor en Mente'}</option>
                  <option value="exercise">🏃 {isEn ? 'Best in Exercise' : 'Mejor en Ejercicio'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-[#101917] rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-50/80 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
                    <th className="py-3 px-4 w-12 text-center">{t('dashColRank')}</th>
                    <th className="py-3 px-4 min-w-[160px]">{t('dashColParticipant')}</th>
                    <th className="py-3 px-4 min-w-[140px] text-center">{t('dashColTotal')}</th>
                    <th className="py-3 px-4 min-w-[220px]">{t('dashColPillars')}</th>
                    <th className="py-3 px-4 min-w-[140px] hidden md:table-cell">{t('dashColArchetype')}</th>
                    <th className="py-3 px-4 min-w-[100px] hidden lg:table-cell">{t('dashColSource')}</th>
                    <th className="py-3 px-4 text-right">{t('dashColActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
                  {filteredParticipants.map((p, index) => {
                    const badge = getScoreBadge(p.totalScore);
                    const isTop3 = index < 3 && sortBy === 'totalDesc';

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-colors group"
                      >
                        {/* Rank Position */}
                        <td className="py-3.5 px-4 text-center font-bold">
                          {isTop3 ? (
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white shadow-2xs ${
                                index === 0
                                  ? 'bg-amber-500 ring-2 ring-amber-400/30'
                                  : index === 1
                                  ? 'bg-stone-400'
                                  : 'bg-amber-700'
                              }`}
                            >
                              {index + 1}
                            </span>
                          ) : (
                            <span className="text-stone-400 font-mono text-xs">{index + 1}</span>
                          )}
                        </td>

                        {/* Participant Name & Date */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0 ring-1 ring-emerald-600/20">
                              {p.userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-stone-900 dark:text-stone-100 block truncate">
                                {p.userName}
                              </span>
                              <span className="text-[11px] text-stone-400 font-mono block">
                                {new Date(p.date).toLocaleDateString(
                                  language === 'en' ? 'en-US' : 'es-ES',
                                  { month: 'short', day: 'numeric', year: 'numeric' }
                                )}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Overall Total Score with Progress Bar */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <div className="flex items-baseline gap-1">
                              <span className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white tabular-nums">
                                {p.totalScore}%
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold border ${badge.bg}`}
                              >
                                {badge.label}
                              </span>
                            </div>
                            <div className="w-24 h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden mt-1">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  p.totalScore >= 80
                                    ? 'bg-emerald-500'
                                    : p.totalScore >= 65
                                    ? 'bg-teal-500'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(100, Math.max(5, p.totalScore))}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* 4 Pillars Breakdown */}
                        <td className="py-3.5 px-4">
                          <div className="grid grid-cols-4 gap-2 text-center text-xs">
                            {/* Sleep */}
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                                🌙 <span className="hidden sm:inline">Sueño</span>
                              </span>
                              <span className="font-bold font-mono text-stone-800 dark:text-stone-200 tabular-nums">
                                {p.pillarScores.sleep || 0}%
                              </span>
                            </div>

                            {/* Nutrition */}
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                                🍎 <span className="hidden sm:inline">Nutr.</span>
                              </span>
                              <span className="font-bold font-mono text-stone-800 dark:text-stone-200 tabular-nums">
                                {p.pillarScores.nutrition || 0}%
                              </span>
                            </div>

                            {/* Mind */}
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                                🧠 <span className="hidden sm:inline">Mente</span>
                              </span>
                              <span className="font-bold font-mono text-stone-800 dark:text-stone-200 tabular-nums">
                                {p.pillarScores.mind || 0}%
                              </span>
                            </div>

                            {/* Exercise */}
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                                🏃 <span className="hidden sm:inline">Mov.</span>
                              </span>
                              <span className="font-bold font-mono text-stone-800 dark:text-stone-200 tabular-nums">
                                {p.pillarScores.exercise || 0}%
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Archetype */}
                        <td className="py-3.5 px-4 hidden md:table-cell">
                          <span className="font-medium text-stone-700 dark:text-stone-300 truncate block max-w-[160px]">
                            {p.archetypeTitle}
                          </span>
                        </td>

                        {/* Source Badge */}
                        <td className="py-3.5 px-4 hidden lg:table-cell">
                          {p.source === 'sheets' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                              <span>Google Sheets</span>
                            </span>
                          )}
                          {p.source === 'local' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 dark:text-stone-400">
                              <HardDrive className="w-3.5 h-3.5" />
                              <span>Local</span>
                            </span>
                          )}
                          {p.source === 'sample' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Muestra</span>
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View in Radar */}
                            <button
                              type="button"
                              onClick={() => {
                                if (!selectedRadarIds.includes(p.id)) {
                                  setSelectedRadarIds([p.id, ...selectedRadarIds.slice(0, 2)]);
                                }
                                setActiveTab('radar');
                              }}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                              title={t('dashBtnSelectRadar')}
                            >
                              <Radar className="w-4 h-4" />
                            </button>

                            {/* Compare 1v1 */}
                            <button
                              type="button"
                              onClick={() => {
                                setOneOnOneAId(p.id);
                                const other = participants.find((item) => item.id !== p.id);
                                if (other) setOneOnOneBId(other.id);
                                setActiveTab('1v1');
                              }}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                              title={t('dashBtnCompareDual')}
                            >
                              <GitCompare className="w-4 h-4" />
                            </button>

                            {/* View Full Report */}
                            <button
                              type="button"
                              onClick={() => onSelectEvaluation(p.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                              title={t('dashBtnViewReport')}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer info */}
            <div className="px-5 py-3 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 flex items-center justify-between text-xs text-stone-400">
              <span>
                {isEn ? 'Showing' : 'Mostrando'} {filteredParticipants.length} {isEn ? 'of' : 'de'}{' '}
                {participants.length} {isEn ? 'participants' : 'participantes'}
              </span>
              <span className="font-mono text-[11px]">
                {isEn ? 'Dashed benchmark: 80% Healthy Optimal' : 'Referencia meta: 80% Saludable Óptimo'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Multi-Participant Radar Overlay */}
      {participants.length > 0 && activeTab === 'radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Radar Chart Display */}
          <div className="lg:col-span-7 bg-white dark:bg-[#101917] rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  {isEn ? 'Multi-Radar Overlay' : 'Radar Multi-Participante'}
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  {isEn ? 'Habits Radar Comparison' : 'Comparativa Visual de Rendimiento'}
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-400">
                {selectedRadarIds.length} {isEn ? 'selected' : 'seleccionados'} (max 4)
              </span>
            </div>

            {/* SVG Radar */}
            <div className="relative my-2 select-none">
              <svg width={radarSize} height={radarSize} className="overflow-visible">
                {/* Concentric Grid Rings */}
                {[25, 50, 75, 100].map((level) => {
                  const points = radarAxes
                    .map((axis) => {
                      const pt = polarToCartesian(level, axis.angleDeg);
                      return `${pt.x},${pt.y}`;
                    })
                    .join(' ');
                  return (
                    <polygon
                      key={level}
                      points={points}
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={level === 75 ? '3 3' : undefined}
                      className="text-stone-200 dark:text-stone-800"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Axes lines */}
                {radarAxes.map((axis) => {
                  const pt = polarToCartesian(100, axis.angleDeg);
                  return (
                    <line
                      key={axis.id}
                      x1={radarCenter}
                      y1={radarCenter}
                      x2={pt.x}
                      y2={pt.y}
                      stroke="currentColor"
                      className="text-stone-200 dark:text-stone-800"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* 80% Healthy Baseline Reference Polygon */}
                <polygon
                  points={baselinePoints}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />

                {/* Group Average Shaded Area */}
                <polygon
                  points={getPolygonPoints(metrics.pillarAverages)}
                  fill="rgba(168, 162, 158, 0.15)"
                  stroke="#78716c"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />

                {/* Selected Participants Polygons */}
                {selectedRadarIds.map((id, idx) => {
                  const p = participants.find((item) => item.id === id);
                  if (!p) return null;
                  const color = PALETTE[idx % PALETTE.length];
                  const points = getPolygonPoints(p.pillarScores);

                  return (
                    <g key={p.id}>
                      <polygon
                        points={points}
                        fill={color.fill}
                        stroke={color.stroke}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                      {radarAxes.map((axis) => {
                        const score = p.pillarScores[axis.id] ?? 0;
                        const pt = polarToCartesian(score, axis.angleDeg);
                        return (
                          <circle
                            key={`${p.id}-${axis.id}`}
                            cx={pt.x}
                            cy={pt.y}
                            r="3.5"
                            fill={color.stroke}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                        );
                      })}
                    </g>
                  );
                })}

                {/* Labels at outer vertices */}
                {radarAxes.map((axis) => {
                  const labelRadius = radarRadius + 28;
                  const angleRad = (axis.angleDeg * Math.PI) / 180;
                  const lx = radarCenter + labelRadius * Math.cos(angleRad);
                  const ly = radarCenter + labelRadius * Math.sin(angleRad);

                  return (
                    <text
                      key={axis.id}
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[11px] font-bold fill-stone-700 dark:fill-stone-300"
                    >
                      {axis.name}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Static Legend Bar */}
            <div className="w-full pt-4 mt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-stone-500">
                <span className="w-4 h-0.5 border-b-2 border-dashed border-emerald-500" />
                <span>{t('dashRadarGoal')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-500">
                <span className="w-4 h-2 bg-stone-400/20 border border-stone-500 border-dashed rounded-xs" />
                <span>{t('dashRadarReference')}</span>
              </div>
            </div>
          </div>

          {/* Participant Selector & Performance Cards */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white dark:bg-[#101917] rounded-3xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  {isEn ? 'Select Participants to Overlay' : 'Selecciona Participantes a Comparar'}
                </h4>
                <span className="text-[11px] text-stone-400">
                  {selectedRadarIds.length} / 4 {isEn ? 'active' : 'activos'}
                </span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {participants.map((p) => {
                  const isSelected = selectedRadarIds.includes(p.id);
                  const colorIdx = selectedRadarIds.indexOf(p.id);
                  const color = colorIdx >= 0 ? PALETTE[colorIdx % PALETTE.length] : null;

                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleRadarParticipant(p.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                          : 'border-stone-200/80 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Color swatch or blank indicator */}
                        <div
                          className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center border"
                          style={{
                            backgroundColor: color ? color.stroke : 'transparent',
                            borderColor: color ? color.stroke : '#a8a29e',
                          }}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>

                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white block truncate">
                            {p.userName}
                          </span>
                          <span className="text-[10px] text-stone-400 block truncate font-mono">
                            {p.archetypeTitle}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-stone-900 dark:text-white font-mono">
                          {p.totalScore}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Pillar Detailed Analytics */}
      {participants.length > 0 && activeTab === 'pillars' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(['sleep', 'nutrition', 'mind', 'exercise'] as PillarId[]).map((pillarId) => {
              const pillar = pillars[pillarId];
              const avg = metrics.pillarAverages[pillarId] || 0;
              const sortedByPillar = [...participants].sort(
                (a, b) => (b.pillarScores[pillarId] || 0) - (a.pillarScores[pillarId] || 0)
              );
              const bestInPillar = sortedByPillar[0];
              const above80Count = participants.filter(
                (p) => (p.pillarScores[pillarId] || 0) >= 80
              ).length;
              const above80Pct = Math.round((above80Count / participants.length) * 100);

              const pillarIcons: Record<PillarId, React.ReactNode> = {
                sleep: <Moon className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
                nutrition: <Apple className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
                mind: <Brain className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
                exercise: <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
              };

              return (
                <div
                  key={pillar.id}
                  className="bg-white dark:bg-[#101917] rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                        {pillarIcons[pillar.id]}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-stone-900 dark:text-white">
                          {pillar.name}
                        </h3>
                        <p className="text-xs text-stone-400">{pillar.subtitle}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-stone-900 dark:text-white tabular-nums">
                        {avg}%
                      </span>
                      <span className="text-[11px] text-stone-400 block font-mono">
                        {isEn ? 'group avg' : 'media grupal'}
                      </span>
                    </div>
                  </div>

                  {/* Benchmark Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>{isEn ? 'Group Average vs 80% Optimal Target' : 'Media grupal vs Meta Óptima (80%)'}</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200 font-mono">
                        {avg >= 80 ? `+${avg - 80}%` : `${avg - 80}%`}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full relative overflow-hidden">
                      {/* 80% marker */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-stone-400 dark:bg-stone-500 z-10"
                        style={{ left: '80%' }}
                      />
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, avg))}%` }}
                      />
                    </div>
                  </div>

                  {/* Top Performer & Stats in this pillar */}
                  <div className="p-3.5 rounded-2xl bg-stone-50/70 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                        {isEn ? 'Top Performer' : 'Mayor Puntuación'}
                      </span>
                      <span className="font-bold text-stone-900 dark:text-white truncate block max-w-[160px]">
                        {bestInPillar?.userName || '—'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                        {isEn ? 'Reaching 80%+' : 'Alcanzan 80%+'}
                      </span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                        {above80Pct}% ({above80Count}/{participants.length})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: 1-on-1 Head to Head Comparison */}
      {participants.length > 0 && activeTab === '1v1' && (
        <div className="bg-white dark:bg-[#101917] rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              {isEn ? 'Head-to-Head Comparison' : 'Comparativa Cara a Cara (1 vs 1)'}
            </span>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mt-0.5">
              {isEn ? 'Direct Performance Delta' : 'Contraste Directo de Rendimiento'}
            </h3>
          </div>

          {/* Selectors for Participant A and B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {isEn ? 'Participant A (Primary)' : 'Participante Principal (A)'}
              </label>
              <select
                value={oneOnOneAId}
                onChange={(e) => setOneOnOneAId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#101917] text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.userName} ({p.totalScore}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {isEn ? 'Participant B (Comparison)' : 'Participante de Contraste (B)'}
              </label>
              <select
                value={oneOnOneBId}
                onChange={(e) => setOneOnOneBId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#101917] text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.userName} ({p.totalScore}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Delta Comparison Cards */}
          {eval1v1A && eval1v1B && (
            <div className="space-y-4">
              {/* Overall Score Contrast */}
              <div className="p-5 rounded-2xl bg-stone-50/60 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {eval1v1A.userName}
                  </span>
                  <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-mono">
                    {eval1v1A.totalScore}%
                  </div>
                </div>

                <div className="px-4 py-1.5 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs text-xs font-bold font-mono">
                  {eval1v1A.totalScore - eval1v1B.totalScore > 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      +{eval1v1A.totalScore - eval1v1B.totalScore}% (A supera a B)
                    </span>
                  ) : eval1v1A.totalScore - eval1v1B.totalScore < 0 ? (
                    <span className="text-rose-600 dark:text-rose-400">
                      {eval1v1A.totalScore - eval1v1B.totalScore}% (B supera a A)
                    </span>
                  ) : (
                    <span className="text-stone-400">0% (Empate)</span>
                  )}
                </div>

                <div className="text-center sm:text-right">
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                    {eval1v1B.userName}
                  </span>
                  <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-mono">
                    {eval1v1B.totalScore}%
                  </div>
                </div>
              </div>

              {/* Pillars Diff Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(['sleep', 'nutrition', 'mind', 'exercise'] as PillarId[]).map((pillarId) => {
                  const pInfo = pillars[pillarId];
                  const scoreA = eval1v1A.pillarScores[pillarId] || 0;
                  const scoreB = eval1v1B.pillarScores[pillarId] || 0;
                  const diff = scoreA - scoreB;

                  return (
                    <div
                      key={pillarId}
                      className="p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-[#121c19] space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-stone-800 dark:text-stone-200">{pInfo?.name}</span>
                        <span
                          className={`font-mono ${
                            diff > 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : diff < 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-stone-400'
                          }`}
                        >
                          {diff > 0 ? `+${diff}%` : `${diff}%`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                        <span>
                          {eval1v1A.userName}: <strong className="text-stone-900 dark:text-white">{scoreA}%</strong>
                        </span>
                        <span>
                          {eval1v1B.userName}: <strong className="text-stone-900 dark:text-white">{scoreB}%</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
