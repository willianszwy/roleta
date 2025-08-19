import type { TaskHistory } from '../types';

export interface TaskExportData {
  participant: string;
  task: string;
  description?: string;
  date: string;
  time: string;
}

export function generateTaskCSV(data: TaskHistory[]): string {
  if (data.length === 0) {
    return 'Data,Hora,Participante,Tarefa,Descrição\n';
  }

  const headers = ['Data', 'Hora', 'Participante', 'Tarefa', 'Descrição'];
  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      formatDateForCSV(item.selectedAt),
      formatTimeForCSV(item.selectedAt),
      `"${item.participants.map(p => p.name).join(', ').replace(/"/g, '""')}"`, // Escape quotes
      `"${item.taskName.replace(/"/g, '""')}"`, // Escape quotes
      `"${(item.taskDescription || '').replace(/"/g, '""')}"` // Escape quotes
    ].join(','))
  ].join('\n');

  return csvContent;
}

export function downloadTaskCSV(csvContent: string, filename: string = 'sorteio-tarefas.csv'): void {
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

export function generateTaskJSON(data: TaskHistory[]): string {
  const exportData: TaskExportData[] = data.map(item => ({
    participant: item.participants.map(p => p.name).join(', '),
    task: item.taskName,
    description: item.taskDescription,
    date: formatDateForExport(item.selectedAt),
    time: formatTimeForExport(item.selectedAt),
  }));

  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    totalAssignments: data.length,
    data: exportData
  }, null, 2);
}

export function downloadTaskJSON(jsonContent: string, filename: string = 'sorteio-tarefas.json'): void {
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
  
  return `${day}/${month}/${year}`;
}

function formatTimeForCSV(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

function formatDateForExport(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTimeForExport(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function exportTaskHistory(data: TaskHistory[], format: 'csv' | 'json' = 'csv'): void {
  if (data.length === 0) {
    alert('Não há dados para exportar!');
    return;
  }

  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
  
  if (format === 'csv') {
    const csvContent = generateTaskCSV(data);
    downloadTaskCSV(csvContent, `sorteio-tarefas-${timestamp}.csv`);
  } else {
    const jsonContent = generateTaskJSON(data);
    downloadTaskJSON(jsonContent, `sorteio-tarefas-${timestamp}.json`);
  }
}

// Helper function to get summary statistics
export function getTaskHistoryStats(data: TaskHistory[]) {
  const participantCounts = new Map<string, number>();
  const taskCounts = new Map<string, number>();
  
  data.forEach(item => {
    // Count each participant in multi-participant tasks
    item.participants.forEach(participant => {
      participantCounts.set(participant.name, (participantCounts.get(participant.name) || 0) + 1);
    });
    taskCounts.set(item.taskName, (taskCounts.get(item.taskName) || 0) + 1);
  });
  
  return {
    totalAssignments: data.length,
    uniqueParticipants: participantCounts.size,
    uniqueTasks: taskCounts.size,
    participantCounts: Object.fromEntries(participantCounts),
    taskCounts: Object.fromEntries(taskCounts),
    mostAssignedParticipant: [...participantCounts.entries()].reduce((a, b) => a[1] > b[1] ? a : b, ['', 0]),
    mostAssignedTask: [...taskCounts.entries()].reduce((a, b) => a[1] > b[1] ? a : b, ['', 0]),
  };
}