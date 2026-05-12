import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import type { CourseEntry, CourseType } from '../models';
import { scoreToGrade, scoreToPoint } from '../models/grading';

interface Props {
  index: number;
  course: CourseEntry;
  onChange: (patch: Partial<Omit<CourseEntry, 'id'>>) => void;
  onDelete: () => void;
}

const TYPES: { value: CourseType; label: string }[] = [
  { value: 'CORE/COMPULSORY COURSE', label: 'Core' },
  { value: 'ELECTIVE', label: 'Elective' },
];

export function CourseRow({ index, course, onChange, onDelete }: Props) {
  const [unitsText, setUnitsText] = useState(
    course.creditUnits > 0 ? String(course.creditUnits) : '',
  );
  const [scoreText, setScoreText] = useState(
    course.score > 0 ? String(course.score) : '',
  );

  const hasScore = scoreText.trim().length > 0;
  const grade = hasScore ? scoreToGrade(course.score) : '—';
  const gradePoint = hasScore ? scoreToPoint(course.score) : 0;

  const unitsInvalid =
    unitsText.length > 0 && (Number(unitsText) <= 0 || isNaN(Number(unitsText)));
  const scoreInvalid =
    scoreText.length > 0 &&
    (Number(scoreText) < 0 || Number(scoreText) > 100 || isNaN(Number(scoreText)));

  const confirmDelete = () => {
    Alert.alert('Remove course', 'Delete this course from the semester?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.indexBadge}>#{index + 1}</Text>
        <Pressable onPress={confirmDelete} hitSlop={8}>
          <Text style={styles.deleteText}>Remove</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Course Code</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. CSC401"
        placeholderTextColor={colors.textMuted}
        value={course.code}
        onChangeText={(v) => onChange({ code: v.toUpperCase() })}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Course Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Algorithms and Complexity Analysis"
        placeholderTextColor={colors.textMuted}
        value={course.title}
        onChangeText={(v) => onChange({ title: v })}
      />

      <View style={styles.twoCol}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Units</Text>
          <TextInput
            style={[styles.input, unitsInvalid && styles.inputError]}
            placeholder="2"
            placeholderTextColor={colors.textMuted}
            value={unitsText}
            keyboardType="number-pad"
            onChangeText={(v) => {
              setUnitsText(v);
              const n = Number(v);
              if (v === '') onChange({ creditUnits: 0 });
              else if (!isNaN(n) && n > 0) onChange({ creditUnits: n });
            }}
          />
          {unitsInvalid && <Text style={styles.errorText}>Must be {'>'} 0</Text>}
        </View>
        <View style={{ flex: 1.4 }}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeRow}>
            {TYPES.map((t) => {
              const active = course.type === t.value;
              return (
                <Pressable
                  key={t.value}
                  onPress={() => onChange({ type: t.value })}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                >
                  <Text
                    style={[styles.typeText, active && styles.typeTextActive]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <Text style={styles.label}>Score (0–100)</Text>
      <TextInput
        style={[styles.input, scoreInvalid && styles.inputError]}
        placeholder="e.g. 72"
        placeholderTextColor={colors.textMuted}
        value={scoreText}
        keyboardType="number-pad"
        onChangeText={(v) => {
          setScoreText(v);
          const n = Number(v);
          if (v === '') onChange({ score: 0 });
          else if (!isNaN(n) && n >= 0 && n <= 100) onChange({ score: n });
        }}
      />
      {scoreInvalid && (
        <Text style={styles.errorText}>Must be between 0 and 100</Text>
      )}

      <View style={styles.derivedRow}>
        <View style={styles.derivedCell}>
          <Text style={styles.derivedLabel}>Grade</Text>
          <Text style={[styles.derivedValue, !hasScore && styles.derivedMuted]}>
            {grade}
          </Text>
        </View>
        <View style={styles.derivedDivider} />
        <View style={styles.derivedCell}>
          <Text style={styles.derivedLabel}>Grade Point</Text>
          <Text style={[styles.derivedValue, !hasScore && styles.derivedMuted]}>
            {hasScore ? gradePoint : '—'}
          </Text>
        </View>
        <View style={styles.derivedDivider} />
        <View style={styles.derivedCell}>
          <Text style={styles.derivedLabel}>Quality Pts</Text>
          <Text style={[styles.derivedValue, !hasScore && styles.derivedMuted]}>
            {hasScore ? gradePoint * course.creditUnits : '—'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  indexBadge: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  deleteText: { ...typography.caption, color: colors.danger, fontWeight: '600' },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  inputError: { borderColor: colors.danger },
  errorText: { ...typography.caption, color: colors.danger, marginTop: 2 },
  twoCol: { flexDirection: 'row', gap: spacing.md },
  typeRow: { flexDirection: 'row', gap: spacing.sm },
  typeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeText: { ...typography.caption, color: colors.text },
  typeTextActive: { color: colors.white, fontWeight: '600' },
  derivedRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  derivedCell: { flex: 1, alignItems: 'center' },
  derivedDivider: { width: 1, backgroundColor: colors.border },
  derivedLabel: { ...typography.caption, color: colors.textMuted },
  derivedValue: {
    ...typography.h3,
    color: colors.primary,
    marginTop: 2,
  },
  derivedMuted: { color: colors.textMuted },
});
