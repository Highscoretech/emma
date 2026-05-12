import { useMemo } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, gradient, radius, spacing, typography } from '../theme/theme';
import { useSemesterStore } from '../store/semesterStore';
import { calcCumulative, calcSemester, classify } from '../utils/cgpa';
import { SemesterTranscript } from '../components/SemesterTranscript';
import { exportTranscript } from '../utils/exportTranscript';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'CGPAOutput'>;
type RouteT = RouteProp<RootStackParamList, 'CGPAOutput'>;

export function CGPAOutputScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const focusSemesterId = route.params?.semesterId;

  const semesters = useSemesterStore((s) => s.semesters);
  const deleteSemester = useSemesterStore((s) => s.deleteSemester);

  const sorted = useMemo(
    () => [...semesters].sort((a, b) => a.createdAt - b.createdAt),
    [semesters],
  );

  const cumulative = useMemo(() => calcCumulative(sorted), [sorted]);

  const runningResults = useMemo(() => {
    let runningUnits = 0;
    let runningQp = 0;
    return sorted.map((sem) => {
      const r = calcSemester(sem);
      runningUnits += r.totalUnits;
      runningQp += r.totalQualityPoints;
      const cgpa = runningUnits === 0 ? 0 : runningQp / runningUnits;
      return { result: r, runningCgpa: cgpa, standing: classify(cgpa) };
    });
  }, [sorted]);

  const handleDelete = (semesterId: string, label: string) => {
    Alert.alert('Delete semester', `Delete "${label}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteSemester(semesterId),
      },
    ]);
  };

  if (sorted.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyTitle}>Nothing to show yet</Text>
          <Text style={styles.emptyBody}>
            Add a semester and enter your grades to see your transcript here.
          </Text>
          <Pressable
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('Calculator')}
          >
            <Text style={styles.emptyBtnText}>Go to Calculator</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={gradient.primary} style={styles.headerGradient}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerBar}>
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={12}
              style={styles.backBtn}
            >
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Transcript</Text>
            <Pressable
              onPress={() => exportTranscript(cumulative)}
              hitSlop={12}
              style={styles.exportBtn}
              accessibilityLabel="Export transcript as PDF"
            >
              <Text style={styles.exportText}>Export</Text>
            </Pressable>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Cumulative CGPA</Text>
            <Text style={styles.summaryValue}>{cumulative.cgpa.toFixed(2)}</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCell}>
                <Text style={styles.summaryCellLabel}>Total Units</Text>
                <Text style={styles.summaryCellValue}>{cumulative.totalUnits}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryCell}>
                <Text style={styles.summaryCellLabel}>Semesters</Text>
                <Text style={styles.summaryCellValue}>{sorted.length}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryCell}>
                <Text style={styles.summaryCellLabel}>Standing</Text>
                <Text style={styles.summaryCellValue} numberOfLines={1}>
                  {cumulative.standing}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {runningResults.map(({ result, runningCgpa, standing }) => (
          <View
            key={result.semester.id}
            style={
              focusSemesterId === result.semester.id
                ? styles.focused
                : undefined
            }
          >
            <SemesterTranscript
              result={result}
              runningCgpa={runningCgpa}
              standing={standing}
              onEdit={() =>
                navigation.navigate('GradeEntry', {
                  semesterId: result.semester.id,
                })
              }
              onDelete={() =>
                handleDelete(
                  result.semester.id,
                  `${result.semester.level} — ${result.semester.term}`,
                )
              }
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGradient: { paddingBottom: spacing.lg },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: { width: 60 },
  backIcon: {
    fontSize: 32,
    color: colors.white,
    lineHeight: 32,
    fontWeight: '300',
  },
  exportBtn: { width: 60, alignItems: 'flex-end' },
  exportText: { ...typography.body, color: colors.white, fontWeight: '600' },
  headerTitle: { ...typography.h2, color: colors.white },
  summaryCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  summaryLabel: { ...typography.caption, color: colors.whiteAlpha80 },
  summaryValue: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.white,
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  summaryCell: { flex: 1 },
  summaryCellLabel: { ...typography.caption, color: colors.whiteAlpha80 },
  summaryCellValue: {
    ...typography.h3,
    color: colors.white,
    marginTop: 2,
    fontSize: 14,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: spacing.sm,
  },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  focused: {
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.accent,
    marginBottom: spacing.lg,
  },
  emptyContainer: { flex: 1, backgroundColor: colors.background },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.xs },
  emptyBody: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
  emptyBtnText: { ...typography.button, color: colors.white },
});
