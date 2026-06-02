import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import type { Term } from '../models';
import { VALID_LEVELS } from '../utils/validation';
import { validateSession } from '../utils/validation';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { level: string; session: string; term: Term }) => void;
}

const TERMS: Term[] = ['FIRST SEMESTER', 'SECOND SEMESTER'];

export function AddSemesterModal({ visible, onClose, onSubmit }: Props) {
  const [level, setLevel] = useState('');
  const [session, setSession] = useState('');
  const [term, setTerm] = useState<Term>('FIRST SEMESTER');
  const [sessionError, setSessionError] = useState<string | null>(null);

  const sessionValidationError = validateSession(session);
  const canSubmit = level.trim().length > 0 && sessionValidationError === null;

  const reset = () => {
    setLevel('');
    setSession('');
    setTerm('FIRST SEMESTER');
    setSessionError(null);
  };

  const handleSubmit = () => {
    if (level.trim().length === 0) return;
    const err = validateSession(session);
    if (err) {
      setSessionError(err);
      return;
    }
    onSubmit({ level: level.trim(), session: session.trim(), term });
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Add Semester</Text>

          <Text style={styles.label}>Level</Text>
          <View style={styles.levelRow}>
            {VALID_LEVELS.map((lvl) => {
              const active = level === lvl;
              return (
                <Pressable
                  key={lvl}
                  onPress={() => setLevel(lvl)}
                  style={[styles.levelChip, active && styles.levelChipActive]}
                >
                  <Text
                    style={[styles.levelText, active && styles.levelTextActive]}
                  >
                    {lvl}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Session</Text>
          <TextInput
            style={[styles.input, sessionError && styles.inputError]}
            placeholder="e.g. 2025/2026"
            placeholderTextColor={colors.textMuted}
            value={session}
            keyboardType="numbers-and-punctuation"
            onChangeText={(v) => {
              setSession(v);
              if (sessionError) setSessionError(null);
            }}
          />
          {sessionError && <Text style={styles.errorText}>{sessionError}</Text>}

          <Text style={styles.label}>Term</Text>
          <View style={styles.termRow}>
            {TERMS.map((t) => {
              const active = term === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setTerm(t)}
                  style={[styles.termChip, active && styles.termChipActive]}
                >
                  <Text
                    style={[
                      styles.termText,
                      active && styles.termTextActive,
                    ]}
                  >
                    {t === 'FIRST SEMESTER' ? 'First' : 'Second'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.submitBtn, !canSubmit && styles.submitDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <Text style={styles.submitText}>Create</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  inputError: { borderColor: colors.danger },
  errorText: { ...typography.caption, color: colors.danger, marginTop: 4 },
  levelRow: { flexDirection: 'row', gap: spacing.sm, marginTop: 2 },
  levelChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  levelChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  levelText: { ...typography.body, color: colors.text },
  levelTextActive: { color: colors.white, fontWeight: '600' },
  termRow: { flexDirection: 'row', gap: spacing.sm, marginTop: 2 },
  termChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  termChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termText: { ...typography.body, color: colors.text },
  termTextActive: { color: colors.white, fontWeight: '600' },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: { ...typography.button, color: colors.textMuted },
  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  submitDisabled: { opacity: 0.4 },
  submitText: { ...typography.button, color: colors.white },
});
