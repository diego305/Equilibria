import React, { useState } from 'react';
import { PillarId } from '../types/wellness';
import { getPillars } from '../data/wellnessData';
import { useLanguage } from '../context/LanguageContext';

interface RadarChartProps {
  currentScores: Record<PillarId, number>;
  comparisonScores?: Record<PillarId, number>;
  comparisonLabel?: string;
  size?: number;
}

const AXIS_ORDER: { id: PillarId; angleDeg: number }[] = [
  { id: 'sleep', angleDeg: 270 }, // Top
  { id: 'nutrition', angleDeg: 0 }, // Right
  { id: 'exercise', angleDeg: 90 }, // Bottom
  { id: 'mind', angleDeg: 180 }, // Left
];

const IDEAL_BASELINE = 80;

export const RadarChart: React.FC<RadarChartProps> = ({
  currentScores,
  comparisonScores,
  comparisonLabel,
  size = 320,
}) => {
  const { language, t } = useLanguage();
  const pillars = getPillars(language);
  const [activePillar, setActivePillar] = useState<PillarId | null>(null);

  const center = size / 2;
  const radius = size * 0.38;

  // Converts polar coordinates (score 0-100, angle) to cartesian (x, y)
  const polarToCartesian = (score: number, angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (score / 100) * radius;
    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);
    return { x, y };
  };

  // Polygon points generator
  const getPolygonPoints = (scores: Record<PillarId, number>) => {
    return AXIS_ORDER.map((axis) => {
      const pt = polarToCartesian(scores[axis.id] ?? 0, axis.angleDeg);
      return `${pt.x},${pt.y}`;
    }).join(' ');
  };

  const getBaselinePoints = () => {
    return AXIS_ORDER.map((axis) => {
      const pt = polarToCartesian(IDEAL_BASELINE, axis.angleDeg);
      return `${pt.x},${pt.y}`;
    }).join(' ');
  };

  // Concentric polygon grids
  const rings = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full overflow-visible transition-colors"
        >
          <defs>
            {/* Natural Sage to Sky User gradient */}
            <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.25" />
            </linearGradient>

            {/* Calm Ocean Blue Comparison gradient */}
            <linearGradient id="compGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Background web rings */}
          {rings.map((ringValue) => {
            const points = AXIS_ORDER.map((axis) => {
              const pt = polarToCartesian(ringValue, axis.angleDeg);
              return `${pt.x},${pt.y}`;
            }).join(' ');
            return (
              <polygon
                key={ringValue}
                points={points}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-stone-200 dark:text-stone-800"
                strokeDasharray={ringValue === 100 ? undefined : '2,2'}
              />
            );
          })}

          {/* Ring percentage indicators */}
          {rings.map((ringValue) => {
            const pt = polarToCartesian(ringValue, 270);
            return (
              <text
                key={`text-${ringValue}`}
                x={pt.x + 4}
                y={pt.y - 2}
                fontSize="9"
                className="fill-stone-400 dark:fill-stone-500 font-mono tabular-nums select-none"
              >
                {ringValue}%
              </text>
            );
          })}

          {/* Axis lines */}
          {AXIS_ORDER.map((axis) => {
            const outerPt = polarToCartesian(100, axis.angleDeg);
            return (
              <line
                key={`line-${axis.id}`}
                x1={center}
                y1={center}
                x2={outerPt.x}
                y2={outerPt.y}
                stroke="currentColor"
                strokeWidth="1.2"
                className="text-stone-200 dark:text-stone-800"
              />
            );
          })}

          {/* Ideal Healthy Baseline (80%) polygon */}
          <polygon
            points={getBaselinePoints()}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            className="text-emerald-500/80 dark:text-emerald-400/80"
          />

          {/* Comparison evaluation polygon (if provided) */}
          {comparisonScores && (
            <polygon
              points={getPolygonPoints(comparisonScores)}
              fill="url(#compGrad)"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="3,3"
              className="transition-all duration-300"
            />
          )}

          {/* User Score polygon */}
          <polygon
            points={getPolygonPoints(currentScores)}
            fill="url(#userGrad)"
            stroke="#059669"
            strokeWidth="2.5"
            className="transition-all duration-300 drop-shadow-xs"
          />

          {/* Vertices & touch hotspots */}
          {AXIS_ORDER.map((axis) => {
            const pt = polarToCartesian(currentScores[axis.id] ?? 0, axis.angleDeg);
            const isHovered = activePillar === axis.id;
            return (
              <g
                key={`vertex-${axis.id}`}
                className="cursor-pointer"
                onMouseEnter={() => setActivePillar(axis.id)}
                onMouseLeave={() => setActivePillar(null)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4.5}
                  fill="#ffffff"
                  stroke="#059669"
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />
                {/* Hitbox */}
                <circle cx={pt.x} cy={pt.y} r={16} fill="transparent" />
              </g>
            );
          })}

          {/* Axis Labels outside the polygon */}
          {AXIS_ORDER.map((axis) => {
            const labelDistance = radius + 22;
            const angleRad = (axis.angleDeg * Math.PI) / 180;
            const lx = center + labelDistance * Math.cos(angleRad);
            const ly = center + labelDistance * Math.sin(angleRad);

            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            let dy = '0.35em';
            if (axis.angleDeg === 0) {
              textAnchor = 'start';
            } else if (axis.angleDeg === 180) {
              textAnchor = 'end';
            } else if (axis.angleDeg === 270) {
              dy = '-0.3em';
            } else if (axis.angleDeg === 90) {
              dy = '1.1em';
            }

            const pillarInfo = pillars[axis.id];
            const score = currentScores[axis.id] ?? 0;

            return (
              <g
                key={`label-${axis.id}`}
                className="cursor-pointer select-none"
                onClick={() => setActivePillar(axis.id)}
              >
                <text
                  x={lx}
                  y={ly}
                  textAnchor={textAnchor}
                  dy={dy}
                  className={`text-xs font-semibold transition-colors ${
                    activePillar === axis.id
                      ? 'fill-emerald-700 dark:fill-emerald-300'
                      : 'fill-stone-700 dark:fill-stone-300'
                  }`}
                >
                  {pillarInfo.name.split(' ')[0]}
                </text>
                <text
                  x={lx}
                  y={ly}
                  textAnchor={textAnchor}
                  dy={axis.angleDeg === 270 ? '0.7em' : axis.angleDeg === 90 ? '2.1em' : '1.45em'}
                  className="text-[11px] font-mono tabular-nums fill-emerald-600 dark:fill-emerald-400 font-medium"
                >
                  {score}%
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover pill detail tooltip */}
        {activePillar && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-stone-900/90 text-white dark:bg-stone-800/95 dark:text-stone-100 text-xs py-1.5 px-3 rounded-lg shadow-lg backdrop-blur-sm border border-stone-700/50 flex flex-col items-center gap-0.5 z-10 transition-all">
            <span className="font-semibold">{pillars[activePillar].name}</span>
            <span className="font-mono tabular-nums text-emerald-300 text-sm">
              {currentScores[activePillar]}%
            </span>
            <span className="text-[10px] text-stone-300 text-center max-w-[140px]">
              {pillars[activePillar].subtitle}
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4 text-xs text-stone-600 dark:text-stone-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 inline-block" />
          <span>{t('radarUser')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-0.5 border-t-2 border-dashed border-emerald-500 dark:border-emerald-400 inline-block" />
          <span>{t('radarOptimal')}</span>
        </div>
        {comparisonScores && (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1.5 rounded-full bg-sky-600 inline-block" />
            <span>{comparisonLabel || t('radarPrevious')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
