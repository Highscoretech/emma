import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import type { SemesterResult } from '../utils/cgpa';

interface Props {
  result: SemesterResult;
  runningCgpa: number;
  standing: string;
  onEdit: () => void;
  onDelete: () => void;
}

const COL_WIDTHS = {
  sn: 36,
  code: 90,
  title: 180,
  unit: 50,
  type: 130,
  score: 56,
  grade: 56,
  point: 92,
} as const;

const TOTAL_TABLE_WIDTH = Object.values(COL_WIDTHS).reduce((a, b) => a + b, 0);

export function SemesterTranscript({
  result,
  runningCgpa,
  standing,
  onEdit,
  onDelete,
}: Props) {
  const { semester, rows, totalUnits, gpa, outstandings } = result;

  return (
    <View style={styles.section}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          {semester.level} — {semester.term} — {semester.session}
        </Text>
      </View>

      <View style={styles.tableWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={{ width: TOTAL_TABLE_WIDTH }}>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.headerCell, { width: COL_WIDTHS.sn }]}>S/N</Text>
              <Text style={[styles.cell, styles.headerCell, { width: COL_WIDTHS.code }]}>Code</Text>
              <Text style={[styles.cell, styles.headerCell, { width: COL_WIDTHS.title }]}>Title</Text>
              <Text style={[styles.cell, styles.headerCell, { width: COL_WIDTHS.unit }]}>Unit</Text>
              <Text style={[styles.cell, styles.headerCell, { width: COL_WIDTHS.type }]}>Type</Text>
              <Text style={[styles.cell, styles.headerCell, { width: COL_WIDTHS.score }]}>Score</Text>
              <Text style={[styles.cell, styles.headerCell, { width: COL_WIDTHS.grade }]}>Grade</Text>
              <Text style={[styles.cell, styles.headerCell, { width: COL_WIDTHS.point }]}>Grade Point</Text>
            </View>

            {rows.map((r, idx) => (
              <View key={r.course.id} style={[styles.row, idx % 2 === 1 && styles.rowAlt]}>
                <Text style={[styles.cell, { width: COL_WIDTHS.sn }]}>{idx + 1}</Text>
                <Text style={[styles.cell, { width: COL_WIDTHS.code }]} numberOfLines={1}>
                  {r.course.code || '—'}
                </Text>
                <Text style={[styles.cell, { width: COL_WIDTHS.title }]} numberOfLines={2}>
                  {r.course.title || '—'}
                </Text>
                <Text style={[styles.cell, { width: COL_WIDTHS.unit }]}>{r.course.creditUnits}</Text>
                <Text style={[styles.cell, styles.typeCell, { width: COL_WIDTHS.type }]} numberOfLines={2}>
                  {r.course.type === 'CORE/COMPULSORY COURSE' ? 'Core' : 'Elective'}
                </Text>
                <Text style={[styles.cell, { width: COL_WIDTHS.score }]}>{r.course.score}</Text>
                <Text
                  style={[
                    styles.cell,
                    styles.gradeCell,
                    !r.passed && styles.gradeFail,
                    { width: COL_WIDTHS.grade },
                  ]}
                >
                  {r.grade}
                </Text>
                <Text style={[styles.cell, { width: COL_WIDTHS.point }]}>{r.qualityPoints}</Text>
              </View>
            ))}

            <View style={[styles.row, styles.totalRow]}>
              <Text
                style={[styles.cell, styles.totalLabel, { width: COL_WIDTHS.sn + COL_WIDTHS.code + COL_WIDTHS.title }]}
              >
                TOTAL
              </Text>
              <Text style={[styles.cell, styles.totalValue, { width: COL_WIDTHS.unit }]}>
                {totalUnits}
              </Text>
              <Text
                style={[styles.cell, { width: COL_WIDTHS.type + COL_WIDTHS.score + COL_WIDTHS.grade }]}
              />
              <Text style={[styles.cell, styles.totalValue, { width: COL_WIDTHS.point }]}>
                {result.totalQualityPoints}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <FooterRow
          label="GPA (Total Grade Point ÷ Total Units)"
          value={`${result.totalQualityPoints} ÷ ${totalUnits} = ${gpa.toFixed(2)}`}
          highlight
        />
        <FooterRow label="Semester's CGPA" value={runningCgpa.toFixed(2)} highlight />
        <FooterRow
          label="Outstandings"
          value={
            outstandings.length === 0
              ? 'None'
              : outstandings.map((c) => c.code).join(', ')
          }
          tone={outstandings.length > 0 ? 'danger' : 'normal'}
        />
        <FooterRow label="Academic Standing" value={standing} />
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={onEdit}>
          <Text style={styles.actionText}>Edit</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={onDelete}
        >
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

function FooterRow({
  label,
  value,
  highlight,
  tone = 'normal',
}: {
  label: string;
  value: string;
  highlight?: boolean;
  tone?: 'normal' | 'danger';
}) {
  return (
    <View style={styles.footerRow}>
      <Text style={styles.footerLabel}>{label}</Text>
      <Text
        style={[
          styles.footerValue,
          highlight && styles.footerHighlight,
          tone === 'danger' && styles.footerDanger,
        ]}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  banner: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  bannerText: {
    ...typography.h3,
    color: colors.white,
    textAlign: 'center',
    fontSize: 14,
  },
  tableWrap: { borderBottomWidth: 1, borderBottomColor: colors.border },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 40,
  },
  rowAlt: { backgroundColor: '#FAFBFE' },
  headerRow: {
    backgroundColor: '#EEF3FB',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  totalRow: {
    backgroundColor: '#EEF3FB',
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  totalLabel: {
    fontWeight: '700',
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  totalValue: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.primary,
  },
  cell: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 12,
    color: colors.text,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    textAlignVertical: 'center',
  },
  headerCell: {
    fontWeight: '700',
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  typeCell: { fontSize: 11 },
  gradeCell: { fontWeight: '700', color: colors.primary, textAlign: 'center' },
  gradeFail: { color: colors.danger },
  footer: { padding: spacing.md },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  footerLabel: { ...typography.caption, color: colors.textMuted, flex: 1 },
  footerValue: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  footerHighlight: { color: colors.primary, fontSize: 14 },
  footerDanger: { color: colors.danger },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    paddingTop: 0,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deleteBtn: { borderColor: colors.danger, backgroundColor: '#FFF5F5' },
  actionText: { ...typography.body, color: colors.text, fontWeight: '600' },
  deleteText: { color: colors.danger },
});
