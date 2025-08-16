import type { PrizeHistory } from '../types';

export function generateCSV(data: PrizeHistory[]): string {
  if (data.length === 0) {
    return 'Data,Participante,Prêmio\n';
  }

  const headers = ['Data', 'Participante', 'Prêmio'];
  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      formatDateForCSV(item.selectedAt),
      `"${item.participantName.replace(/"/g, '""')}"`, // Escape quotes
      `"${item.prizeName.replace(/"/g, '""')}"` // Escape quotes
    ].join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSV(csvContent: string, filename: string = 'sorteio-premios.csv'): void {
  // Add BOM for UTF-8 to ensure proper encoding in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append to document, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

export function generateJSON(data: PrizeHistory[]): string {
  return JSON.stringify(data, null, 2);
}

export function downloadJSON(jsonContent: string, filename: string = 'sorteio-premios.json'): void {
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

function formatDateForCSV(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function exportPrizeHistory(data: PrizeHistory[], format: 'csv' | 'json' = 'csv'): void {
  if (data.length === 0) {
    alert('Não há dados para exportar!');
    return;
  }

  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
  
  if (format === 'csv') {
    const csvContent = generateCSV(data);
    downloadCSV(csvContent, `sorteio-premios-${timestamp}.csv`);
  } else {
    const jsonContent = generateJSON(data);
    downloadJSON(jsonContent, `sorteio-premios-${timestamp}.json`);
  }
}