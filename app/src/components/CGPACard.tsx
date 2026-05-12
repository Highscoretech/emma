import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import type { AcademicStanding } from '../utils/cgpa';

interface Props {
  cgpa: number;
  totalUnits: number;
  standing: AcademicStanding;
  hasData: boolean;
}

export function CGPACard({ cgpa, totalUnits, standing, hasData }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Cumulative GPA</Text>
      <Text style={styles.value}>{hasData ? cgpa.toFixed(2) : '—'}</Text>
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>Units</Text>
          <Text style={styles.cellValue}>{totalUnits}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>Standing</Text>
          <Text style={styles.cellValue} numberOfLines={1}>
            {hasData ? standing : '—'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  label: { ...typography.caption, color: colors.textMuted },
  value: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cell: { flex: 1 },
  cellLabel: { ...typography.caption, color: colors.textMuted },
  cellValue: {
    ...typography.h3,
    color: colors.text,
    marginTop: 2,
  },
  divider: { width: 1, backgroundColor: colors.border, marginHorizontal: spacing.md },
});
