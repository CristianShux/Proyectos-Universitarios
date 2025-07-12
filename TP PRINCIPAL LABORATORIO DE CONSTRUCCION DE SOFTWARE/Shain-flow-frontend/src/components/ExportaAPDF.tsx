// exportChartsToPDF.ts
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export const exportChartsToPDF = async () => {
  const chartElements = document.getElementsByClassName('chart-container');
  if (chartElements.length === 0) {
    console.error('No se encontraron elementos de gráficos.');
    return;
  }

  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yOffset = margin;

  for (let i = 0; i < chartElements.length; i++) {
    const chartElement = chartElements[i] as HTMLElement;

    try {
      const imgData = await toPng(chartElement);
      const imgProps = chartElement.getBoundingClientRect();
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      if (yOffset + imgHeight > pageHeight - margin) {
        pdf.addPage();
        yOffset = margin;
      }

      pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight);
      yOffset += imgHeight + margin;
    } catch (error) {
      console.error(`Error al procesar el gráfico ${i + 1}:`, error);
    }
  }

  pdf.save('graficos.pdf');
};