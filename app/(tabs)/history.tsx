import React from 'react';
import { StyleSheet, SafeAreaView, SectionList, RefreshControl } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useAngerLog, AngerEntry } from '../../hooks/useAngerLog';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { formatDate, formatTime, groupLogsByDate } from '../../utils/dateHelpers';
import { Calendar, Trash2, Clock } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { logs, loading, refreshLogs, clearLogs } = useAngerLog();

  const sections = groupLogsByDate(logs);

  const renderItem = ({ item }: { item: AngerEntry }) => (
    <Animated.View 
      entering={FadeInUp.duration(400)}
      style={[styles.entryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      <View style={styles.timeRow}>
        <Clock size={16} color={theme.textMuted} />
        <Text style={[styles.timeText, { color: theme.text }]}>{formatTime(item.timestamp)}</Text>
      </View>
      <View style={[styles.intensityBadge, { backgroundColor: theme.tint + '20' }]}>
        <Text style={[styles.intensityText, { color: theme.tint }]}>Intensity {item.intensity}/5</Text>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Log History</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            {logs.length} total entries recorded
          </Text>
        </View>
        {logs.length > 0 && (
          <Trash2 size={24} color={theme.textMuted} onPress={clearLogs} />
        )}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { date } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{date}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshLogs} tintColor={theme.tint} />
        }
        ListEmptyComponent={
          <Animated.View entering={FadeInDown} style={styles.emptyContainer}>
            <Calendar size={64} color={theme.border} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No entries yet. Relax, that's a good thing!
            </Text>
          </Animated.View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 10,
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
  listContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    flexGrow: 1,
  },
  sectionHeader: {
    paddingVertical: 15,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  entryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  intensityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  intensityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    width: '70%',
    lineHeight: 24,
  },
});
