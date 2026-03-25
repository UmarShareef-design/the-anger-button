import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  useEffect(() => {
    const setup = async () => {
      const hasPermission = await registerForPushNotificationsAsync();
      if (hasPermission) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        scheduleDailyCheckIn();
        scheduleWeeklyReflection();
      }
    };
    setup();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  };

  const scheduleDailyCheckIn = async () => {
    // 9:00 PM Daily
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Evening Reflection 🌙",
        body: "How was your day? Take a moment to check in with yourself.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 21,
        minute: 0,
      },
    });
  };

  const scheduleWeeklyReflection = async () => {
    // Sunday 6:00 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Weekly Pulse ✨",
        body: "Your weekly reflection is ready. Let's see your patterns.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 1, // Sunday
        hour: 18,
        minute: 0,
      },
    });
  };
};
