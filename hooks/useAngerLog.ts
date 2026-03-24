import { useState, useCallback, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { storage, KEYS } from '../utils/storage';

export interface AngerEntry {
  id: string;
  timestamp: number;
  intensity: number;
  note?: string;
}

export const useAngerLog = () => {
  const [logs, setLogs] = useState<AngerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const storedLogs = await storage.get<AngerEntry[]>(KEYS.ANGER_ENTRIES);
    if (storedLogs) {
      setLogs(storedLogs.sort((a, b) => b.timestamp - a.timestamp));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addEntry = useCallback(async (intensity: number = 3, note?: string) => {
    // Satisfying haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newEntry: AngerEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      intensity,
      note,
    };

    const currentLogs = await storage.get<AngerEntry[]>(KEYS.ANGER_ENTRIES) || [];
    const updatedLogs = [newEntry, ...currentLogs];
    
    await storage.save(KEYS.ANGER_ENTRIES, updatedLogs);
    setLogs(updatedLogs);
    return newEntry;
  }, []);

  const clearLogs = useCallback(async () => {
    await storage.clear(KEYS.ANGER_ENTRIES);
    setLogs([]);
  }, []);

  const getTodayTotal = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    return logs.filter(log => new Date(log.timestamp).setHours(0, 0, 0, 0) === today).length;
  };

  return {
    logs,
    loading,
    addEntry,
    clearLogs,
    getTodayTotal,
    refreshLogs: fetchLogs,
  };
};
