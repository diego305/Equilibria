import jsPDF from 'jspdf';
import { EvaluationResult } from '../types/wellness';
import { getPillars } from '../data/wellnessData';
import { Language } from '../data/translations';

export function generateEvaluationPDF(result: EvaluationResult, lang: Language = 'es'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const isEn = lang === 'en';
  const pillars = getPillars(lang);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let currentY = 20;

  // Header background banner
  doc.setFillColor(243, 248, 246); // Soft soothing sage tint
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Decorative subtle accent line
  doc.setFillColor(5, 150, 105); // Emerald 600
  doc.rect(0, 0, pageWidth, 2.5, 'F');

  // Brand title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text(
    isEn ? 'EQUILIBRIA · Healthy Habits Report' : 'EQUILIBRIA · Reporte de Buenos Hábitos',
    margin,
    18
  );

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105); // Slate 600
  const formattedDate = new Date(result.date).toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(
    isEn
      ? `Individual assessment for: ${result.userName}  ·  ${formattedDate}`
      : `Evaluación individual para: ${result.userName}  ·  ${formattedDate}`,
    margin,
    27
  );

  currentY = 46;

  // General Score Banner Card
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, currentY, contentWidth, 34, 3, 3, 'FD');

  // Score circle/indicator
  doc.setFillColor(5, 150, 105);
  doc.circle(margin + 18, currentY + 17, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(`${result.totalScore}%`, margin + 18, currentY + 21, { align: 'center' });

  // Archetype text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(result.archetype.title, margin + 36, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const archetypeText = doc.splitTextToSize(result.archetype.description, contentWidth - 42);
  doc.text(archetypeText, margin + 36, currentY + 19);

  currentY += 42;

  // Section: Resultados por Pilar
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn ? '1. Detailed Score by Pillar' : '1. Puntuación Detallada por Pilar',
    margin,
    currentY
  );
  currentY += 6;

  const pillarEntries = [
    { id: 'sleep' as const, name: pillars.sleep.name, score: result.pillarScores.sleep },
    { id: 'nutrition' as const, name: pillars.nutrition.name, score: result.pillarScores.nutrition },
    { id: 'mind' as const, name: pillars.mind.name, score: result.pillarScores.mind },
    { id: 'exercise' as const, name: pillars.exercise.name, score: result.pillarScores.exercise },
  ];

  const colWidth = (contentWidth - 9) / 4;
  pillarEntries.forEach((p, idx) => {
    const colX = margin + idx * (colWidth + 3);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(colX, currentY, colWidth, 24, 2, 2, 'FD');

    // Score bar top
    let barColor: [number, number, number] = [13, 148, 136];
    if (p.score >= 85) barColor = [16, 185, 129];
    else if (p.score >= 70) barColor = [13, 148, 136];
    else if (p.score >= 50) barColor = [245, 158, 11];
    else barColor = [244, 63, 94];

    doc.setFillColor(...barColor);
    doc.rect(colX, currentY, colWidth, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(p.name, colX + colWidth / 2, currentY + 9, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(`${p.score}/100`, colX + colWidth / 2, currentY + 18, { align: 'center' });
  });

  currentY += 32;

  // Section: Recomendaciones Individuales
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn ? '2. Individualized Wellness Recommendations' : '2. Recomendaciones Personalizadas para tu Bienestar',
    margin,
    currentY
  );
  currentY += 6;

  pillarEntries.forEach((p) => {
    const recs = result.recommendations[p.id] || [];
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(241, 245, 249);
    doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${p.name} (${p.score}%)`, margin + 4, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const recLines = recs.slice(0, 2).map((r) => `- ${r}`).join('  ');
    const splitRecs = doc.splitTextToSize(recLines, contentWidth - 8);
    doc.text(splitRecs, margin + 4, currentY + 12);

    currentY += 23;
  });

  currentY += 4;

  // Section: Plan de Acción 7 Días
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isEn ? '3. 7-Day Action Plan (Micro-Habits)' : '3. Plan de Acción de 7 Días (Micro-Hábitos)',
    margin,
    currentY
  );
  currentY += 6;

  result.actionPlan.forEach((planItem) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitPlan = doc.splitTextToSize(`→ ${planItem}`, contentWidth);
    doc.text(splitPlan, margin, currentY);
    currentY += 6;
  });

  // Footer banner
  const footerY = pageHeight - 16;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(13, 148, 136);
  doc.text(
    isEn
      ? 'SLEEP + FOOD + MENTAL HEALTH + PHYSICAL EXERCISE = BALANCE'
      : 'SUEÑO + ALIMENTACIÓN + SALUD MENTAL + EJERCICIO FÍSICO = EQUILIBRIO',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    isEn
      ? 'Small daily changes make a big difference · Equilibria Open Access'
      : 'Pequeños cambios diarios hacen una gran diferencia · Equilibria Acceso Libre',
    pageWidth / 2,
    footerY + 4,
    { align: 'center' }
  );

  // Save the PDF
  const cleanName = (result.userName || (isEn ? 'user' : 'usuario'))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');
  doc.save(`equilibria_habits_${cleanName}_${Date.now()}.pdf`);
}
