import { useMemo } from 'react';
import { AngerEntry } from './useAngerLog';

export interface ReflectionStats {
  totalPresses: number;
  avgIntensity: number;
  peakDay: string;
}

export const useReflections = (logs: AngerEntry[]) => {
  const weeklyStats = useMemo(() => {
    if (logs.length === 0) return null;

    const now = Date.now();
    const startOfWeek = new Date(now - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0);
    const weeklyLogs = logs.filter(log => log.timestamp >= startOfWeek);

    if (weeklyLogs.length === 0) return null;

    const totalPresses = weeklyLogs.length;
    const avgIntensity = weeklyLogs.reduce((acc, log) => acc + log.intensity, 0) / totalPresses;

    // Find peak day
    const dayCounts: { [key: string]: number } = {};
    weeklyLogs.forEach(log => {
      const day = new Date(log.timestamp).toLocaleDateString(undefined, { weekday: 'long' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    const peakDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0][0];

    return {
      totalPresses,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      peakDay
    };
  }, [logs]);

  return { weeklyStats };
};
