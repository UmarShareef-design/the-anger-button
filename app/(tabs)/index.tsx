import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Text, View } from '../../components/Themed';
import { AngerButton } from '../../components/AngerButton';
import { IntensityModal } from '../../components/IntensityModal';
import { useAngerLog } from '../../hooks/useAngerLog';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

const QUOTES = [
  "Take a deep breath. You are in control.",
  "Anger is a messenger, not a master.",
  "Pause. Exhale. Let it be.",
  "Be kind to your mind today.",
  "Peace comes from within."
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { addEntry, getTodayTotal } = useAngerLog();
  const [quote, setQuote] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const handlePress = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = async (intensity: number, note?: string) => {
    setIsModalVisible(false);
    await addEntry(intensity, note);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View entering={FadeIn.delay(300)} style={styles.quoteBox}>
        <Text style={[styles.quoteText, { color: theme.textMuted }]}>
          "{quote}"
        </Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <AngerButton onPress={handlePress} />
        <Animated.View entering={FadeInUp.delay(600)} style={styles.statContainer}>
          <Text style={[styles.countText, { color: theme.text }]}>
            {getTodayTotal()}
          </Text>
          <Text style={[styles.label, { color: theme.textMuted }]}>
            PRESSES TODAY
          </Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textMuted }]}>
          Press the button when you feel the surge. 
          It's okay to feel this way.
        </Text>
      </View>

      <IntensityModal 
        visible={isModalVisible}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  quoteBox: {
    paddingHorizontal: 40,
    marginTop: 20,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '300',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  countText: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 50,
    paddingBottom: 40,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
});
