import { useLayoutEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing, typography } from '../theme/theme';
import { useSemesterStore } from '../store/semesterStore';
import { CourseRow } from '../components/CourseRow';
import { calcSemester } from '../utils/cgpa';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'GradeEntry'>;
type RouteT = RouteProp<RootStackParamList, 'GradeEntry'>;

export function GradeEntryScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const semesterId = route.params?.semesterId;

  const semester = useSemesterStore((s) =>
    semesterId ? s.semesters.find((x) => x.id === semesterId) : undefined,
  );
  const addCourse = useSemesterStore((s) => s.addCourse);
  const updateCourse = useSemesterStore((s) => s.updateCourse);
  const deleteCourse = useSemesterStore((s) => s.deleteCourse);
  const deleteSemester = useSemesterStore((s) => s.deleteSemester);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (!semester) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Semester not found</Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.errorLink}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const result = calcSemester(semester);
  const hasIncompleteRows = semester.courses.some(
    (c) =>
      !c.code.trim() ||
      !c.title.trim() ||
      c.creditUnits <= 0 ||
      c.score < 0 ||
      c.score > 100,
  );
  const canCalculate = semester.courses.length > 0 && !hasIncompleteRows;

  const handleAddCourse = () => {
    addCourse(semester.id, {
      code: '',
      title: '',
      creditUnits: 2,
      type: 'CORE/COMPULSORY COURSE',
      score: 0,
    });
  };

  const handleDeleteSemester = () => {
    Alert.alert(
      'Delete semester',
      `Delete "${semester.level} — ${semester.term}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSemester(semester.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {semester.level}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {semester.term} · {semester.session}
          </Text>
        </View>
        <Pressable onPress={handleDeleteSemester} hitSlop={8}>
          <Text style={styles.headerDelete}>Delete</Text>
        </Pressable>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryCell}>
          <Text style={styles.summaryLabel}>Courses</Text>
          <Text style={styles.summaryValue}>{semester.courses.length}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCell}>
          <Text style={styles.summaryLabel}>Total Units</Text>
          <Text style={styles.summaryValue}>{result.totalUnits}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCell}>
          <Text style={styles.summaryLabel}>GPA</Text>
          <Text style={[styles.summaryValue, styles.summaryGpa]}>
            {semester.courses.length === 0 ? '—' : result.gpa.toFixed(2)}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {semester.courses.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No courses yet</Text>
              <Text style={styles.emptyBody}>
                Tap "Add Course" to start entering grades.
              </Text>
            </View>
          )}

          {semester.courses.map((course, idx) => (
            <CourseRow
              key={course.id}
              index={idx}
              course={course}
              onChange={(patch) => updateCourse(semester.id, course.id, patch)}
              onDelete={() => deleteCourse(semester.id, course.id)}
            />
          ))}

          <Pressable style={styles.addBtn} onPress={handleAddCourse}>
            <Text style={styles.addBtnText}>+ Add Course</Text>
          </Pressable>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.calcBtn,
              !canCalculate && styles.calcBtnDisabled,
            ]}
            disabled={!canCalculate}
            onPress={() =>
              navigation.navigate('CGPAOutput', { semesterId: semester.id })
            }
          >
            <Text style={styles.calcBtnText}>Calculate CGPA</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.md },
  errorLink: { ...typography.body, color: colors.primary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: { width: 32 },
  backIcon: {
    fontSize: 32,
    color: colors.primary,
    lineHeight: 32,
    fontWeight: '300',
  },
  title: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  headerDelete: { ...typography.body, color: colors.danger },
  summary: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryCell: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: colors.border },
  summaryLabel: { ...typography.caption, color: colors.textMuted },
  summaryValue: { ...typography.h3, color: colors.text, marginTop: 2 },
  summaryGpa: { color: colors.primary },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  emptyState: { paddingVertical: spacing.xxl, alignItems: 'center' },
  emptyTitle: { ...typography.h3, color: colors.text },
  emptyBody: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  addBtn: {
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  addBtnText: { ...typography.button, color: colors.primary },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  calcBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  calcBtnDisabled: { opacity: 0.4 },
  calcBtnText: { ...typography.button, color: colors.white },
});
