import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useAngerLog } from '@/hooks/useAngerLog';
import { useReflections } from '@/hooks/useReflections';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

export default function ReflectionsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { logs } = useAngerLog();
  const { weeklyStats } = useReflections(logs);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Self-Reflect</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Seeing patterns is the first step to balance.
          </Text>
        </View>

        {!weeklyStats ? (
          <Animated.View entering={FadeIn.delay(300)} style={[styles.emptyCard, { borderColor: theme.border }]}>
            <Ionicons name="sparkles-outline" size={48} color={theme.border} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              Not enough data yet for a weekly reflection. 
              Keep checking in with yourself.
            </Text>
          </Animated.View>
        ) : (
          <Animated.View entering={SlideInRight.springify()} style={[styles.card, { backgroundColor: theme.accent + '15', borderColor: theme.accent + '40' }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="sparkles-outline" size={24} color={theme.accent} />
              <Text style={[styles.cardTitle, { color: theme.accent }]}>Weekly Pulse</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>{weeklyStats.totalPresses}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>PRESSES</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>{weeklyStats.peakDay}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>PEAK DAY</Text>
              </View>
            </View>

            <View style={[styles.insightBox, { backgroundColor: theme.surface }]}>
              <Ionicons name="analytics-outline" size={20} color={theme.accent} />
              <Text style={[styles.insightText, { color: theme.text }]}>
                Your average intensity was {weeklyStats.avgIntensity}/5. 
              </Text>
            </View>

            <View style={styles.promptBox}>
              <Text style={[styles.promptText, { color: theme.textMuted }]}>
                What patterns do you notice? Was there a specific trigger this week?
              </Text>
            </View>
          </Animated.View>
        )}

        <View style={styles.tipsSection}>
          <Text style={[styles.tipsTitle, { color: theme.text }]}>Calming Techniques</Text>
          <View style={[styles.tipCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.tipLabel, { color: theme.accent }]}>Box Breathing</Text>
            <Text style={[styles.tipDesc, { color: theme.textMuted }]}>
              Inhale for 4. Hold for 4. Exhale for 4. Pause for 4. Repeat.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    padding: 24,
    borderRadius: 30,
    borderWidth: 1.5,
    marginBottom: 30,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 1,
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 20,
  },
  insightText: {
    fontSize: 15,
    fontWeight: '500',
  },
  promptBox: {
    marginTop: 10,
  },
  promptText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: 20,
    marginBottom: 30,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 24,
  },
  tipsSection: {
    marginTop: 10,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  tipCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
  },
  tipLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  tipDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
});
