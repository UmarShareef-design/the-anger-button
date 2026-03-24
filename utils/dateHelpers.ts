export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date(Date.now() - 86400000).setHours(0, 0, 0, 0);
  const entryDate = new Date(timestamp).setHours(0, 0, 0, 0);

  if (entryDate === today) return 'Today';
  if (entryDate === yesterday) return 'Yesterday';
  
  return date.toLocaleDateString(undefined, { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const groupLogsByDate = (logs: any[]) => {
  const groups: { [key: string]: any[] } = {};
  
  logs.forEach(log => {
    const dateLabel = formatDate(log.timestamp);
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(log);
  });
  
  return Object.entries(groups).map(([date, data]) => ({
    date,
    data
  }));
};
