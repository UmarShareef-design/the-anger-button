import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { storage, KEYS } from '@/utils/storage';

export interface AngerEntry {
  id: string;
  timestamp: number;
  intensity: number;
  note?: string;
}

interface AngerLogContextType {
  logs: AngerEntry[];
  loading: boolean;
  addEntry: (intensity?: number, note?: string) => Promise<AngerEntry>;
  clearLogs: () => Promise<void>;
  getTodayTotal: () => number;
  refreshLogs: () => Promise<void>;
}

const AngerLogContext = createContext<AngerLogContextType | undefined>(undefined);

export function AngerLogProvider({ children }: { children: React.ReactNode }) {
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Fixed ID generation with lower risk of collision
    const newEntry: AngerEntry = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
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

  const getTodayTotal = useCallback(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    return logs.filter(log => new Date(log.timestamp).setHours(0, 0, 0, 0) === today).length;
  }, [logs]);

  const value = {
    logs,
    loading,
    addEntry,
    clearLogs,
    getTodayTotal,
    refreshLogs: fetchLogs,
  };

  return <AngerLogContext.Provider value={value}>{children}</AngerLogContext.Provider>;
}

export function useAngerLog() {
  const context = useContext(AngerLogContext);
  if (context === undefined) {
    throw new Error('useAngerLog must be used within an AngerLogProvider');
  }
  return context;
}
