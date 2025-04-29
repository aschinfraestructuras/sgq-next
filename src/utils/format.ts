export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat('pt-BR', options).format(value);
}

export function formatCurrency(value: number) {
  return formatNumber(value, {
    style: 'currency',
    currency: 'BRL'
  });
}

export function formatDate(date: string | Date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function formatDateTime(date: string | Date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatPercent(value: number) {
  return formatNumber(value, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
}

export function formatUnit(value: number, unit: string) {
  return `${formatNumber(value)} ${unit}`;
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}min`;
  }
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
}

export function formatFileSize(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${formatNumber(size, { maximumFractionDigits: 1 })} ${units[unitIndex]}`;
} 