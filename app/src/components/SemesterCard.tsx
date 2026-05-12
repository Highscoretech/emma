import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import type { Semester } from '../models';
import { calcSemester } from '../utils/cgpa';

interface Props {
  semester: Semester;
  onPress: () => void;
}

export function SemesterCard({ semester, onPress }: Props) {
  const result = calcSemester(semester);
  const courseCount = semester.courses.length;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {semester.level} — {semester.term}
          </Text>
          <Text style={styles.session}>{semester.session}</Text>
        </View>
        <View style={styles.gpaPill}>
          <Text style={styles.gpaLabel}>GPA</Text>
          <Text style={styles.gpaValue}>
            {courseCount === 0 ? '—' : result.gpa.toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.meta}>
        <Text style={styles.metaText}>
          {courseCount} {courseCount === 1 ? 'course' : 'courses'}
        </Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>{result.totalUnits} units</Text>
        {result.outstandings.length > 0 && (
          <>
            <Text style={styles.metaDot}>·</Text>
            <Text style={[styles.metaText, styles.outstanding]}>
              {result.outstandings.length} outstanding
            </Text>
          </>
        )}
      </View>
    </Pressable>
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
  pressed: { opacity: 0.7 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  title: { ...typography.h3, color: colors.text },
  session: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  gpaPill: {
    backgroundColor: colors.background,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    alignItems: 'center',
    minWidth: 64,
  },
  gpaLabel: { ...typography.caption, color: colors.textMuted, fontSize: 11 },
  gpaValue: { ...typography.h3, color: colors.primary },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  metaText: { ...typography.caption, color: colors.textMuted },
  metaDot: { ...typography.caption, color: colors.textMuted, marginHorizontal: 6 },
  outstanding: { color: colors.danger },
});
