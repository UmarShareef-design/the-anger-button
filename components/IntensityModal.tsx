import React, { useState } from 'react';
import { StyleSheet, Modal, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, View } from './Themed';
import { Colors } from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

interface IntensityModalProps {
  visible: boolean;
  onClose: (intensity: number, note?: string) => void;
}

const INTENSITIES = [
  { value: 1, label: 'Low', color: '#7BA68C' },
  { value: 2, label: 'Mild', color: '#B4BC7C' },
  { value: 3, label: 'Mod', color: '#D9B44F' },
  { value: 4, label: 'High', color: '#D9824F' },
  { value: 5, label: 'Peak', color: '#D94F4F' },
];

export const IntensityModal = ({ visible, onClose }: IntensityModalProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState("");

  const handleSave = () => {
    onClose(intensity, note);
    setNote("");
    setIntensity(3);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.content, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>Rate the Intensity</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Acknowledgment is the first step to release.
          </Text>

          <View style={styles.intensityRow}>
            {INTENSITIES.map((i) => (
              <Pressable
                key={i.value}
                onPress={() => setIntensity(i.value)}
                style={[
                  styles.intensityBtn,
                  { backgroundColor: intensity === i.value ? i.color : theme.background }
                ]}
              >
                <Text style={[
                  styles.intensityBtnText,
                  { color: intensity === i.value ? '#FFF' : theme.textMuted }
                ]}>
                  {i.value}
                </Text>
                <Text style={[
                  styles.intensityLabel,
                  { color: intensity === i.value ? '#FFF' : theme.textMuted }
                ]}>
                  {i.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            placeholder="Add a note (optional)..."
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
            value={note}
            onChangeText={setNote}
            multiline
          />

          <Pressable 
            onPress={handleSave}
            style={[styles.saveBtn, { backgroundColor: theme.tint }]}
          >
            <Text style={styles.saveBtnText}>Log Entry</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    padding: 30,
    borderRadius: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
  },
  intensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    gap: 8,
  },
  intensityBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityBtnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  intensityLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  input: {
    width: '100%',
    height: 80,
    borderRadius: 16,
    padding: 15,
    marginBottom: 30,
    fontSize: 16,
    borderWidth: 1,
  },
  saveBtn: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
