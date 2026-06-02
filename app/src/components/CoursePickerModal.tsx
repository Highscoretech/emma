import { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import type { Term } from '../models';
import { getCatalogCourses, type CatalogCourse } from '../data/courseCatalog';

interface Props {
  visible: boolean;
  level: string;
  term: Term;
  /** Course codes already added to the semester, so they show as added. */
  existingCodes: string[];
  onClose: () => void;
  onConfirm: (courses: CatalogCourse[]) => void;
}

export function CoursePickerModal({
  visible,
  level,
  term,
  existingCodes,
  onClose,
  onConfirm,
}: Props) {
  const courses = getCatalogCourses(level, term);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Reset selection each time the sheet is opened.
  useEffect(() => {
    if (visible) setSelected({});
  }, [visible]);

  const alreadyAdded = new Set(existingCodes.map((c) => c.toUpperCase()));
  const selectedCount = Object.values(selected).filter(Boolean).length;

  const toggle = (code: string) => {
    setSelected((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const handleConfirm = () => {
    const chosen = courses.filter((c) => selected[c.code]);
    onConfirm(chosen);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>
            {level} Level · {term === 'FIRST SEMESTER' ? 'First' : 'Second'}{' '}
            Semester
          </Text>
          <Text style={styles.subtitle}>
            {courses.length === 0
              ? 'No course list available for this level/semester.'
              : 'Tap the courses you took, then add them.'}
          </Text>

          <FlatList
            data={courses}
            keyExtractor={(c) => c.code}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const added = alreadyAdded.has(item.code.toUpperCase());
              const isSelected = !!selected[item.code];
              return (
                <Pressable
                  disabled={added}
                  onPress={() => toggle(item.code)}
                  style={[
                    styles.row,
                    isSelected && styles.rowSelected,
                    added && styles.rowAdded,
                  ]}
                >
                  <View style={styles.checkbox}>
                    {(isSelected || added) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowCode}>{item.code}</Text>
                    <Text style={styles.rowTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </View>
                  <Text style={styles.rowUnits}>
                    {item.creditUnits}
                    {'\n'}
                    <Text style={styles.rowUnitsLabel}>
                      {item.creditUnits === 1 ? 'unit' : 'units'}
                    </Text>
                  </Text>
                </Pressable>
              );
            }}
          />

          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.submitBtn,
                selectedCount === 0 && styles.submitDisabled,
              ]}
              onPress={handleConfirm}
              disabled={selectedCount === 0}
            >
              <Text style={styles.submitText}>
                {selectedCount > 0 ? `Add ${selectedCount}` : 'Add'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
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
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: { ...typography.h2, color: colors.text },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  list: { flexGrow: 0 },
  listContent: { paddingBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  rowSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(25,118,255,0.06)',
  },
  rowAdded: { opacity: 0.5 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkmark: { color: colors.primary, fontWeight: '700', fontSize: 15 },
  rowText: { flex: 1 },
  rowCode: { ...typography.body, color: colors.text, fontWeight: '600' },
  rowTitle: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  rowUnits: {
    ...typography.h3,
    color: colors.primary,
    textAlign: 'center',
    marginLeft: spacing.sm,
  },
  rowUnitsLabel: { ...typography.caption, color: colors.textMuted },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
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
