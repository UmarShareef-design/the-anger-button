import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  ANGER_ENTRIES: '@anger_entries',
};

export const storage = {
  async save(key: string, value: any) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error('Error saving data:', e);
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error getting data:', e);
      return null;
    }
  },

  async clear(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Error clearing data:', e);
    }
  },
};
