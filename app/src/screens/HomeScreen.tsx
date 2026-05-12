import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, gradient, radius, spacing, typography } from '../theme/theme';
import { useSemesterStore } from '../store/semesterStore';
import { calcCumulative } from '../utils/cgpa';
import { CGPACard } from '../components/CGPACard';
import { PrimaryButton } from '../components/PrimaryButton';
import { FeedbackModal } from '../components/FeedbackModal';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const semesters = useSemesterStore((s) => s.semesters);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const cumulative = useMemo(() => calcCumulative(semesters), [semesters]);
  const hasData = semesters.some((s) => s.courses.length > 0);

  return (
    <LinearGradient colors={gradient.primary} style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.title}>CGPA Calculator</Text>
            </View>
            <Pressable
              onPress={() => setFeedbackOpen(true)}
              hitSlop={12}
              style={styles.feedbackBtn}
              accessibilityLabel="Send feedback"
            >
              <Text style={styles.feedbackIcon}>✉︎</Text>
            </Pressable>
          </View>

          <CGPACard
            cgpa={cumulative.cgpa}
            totalUnits={cumulative.totalUnits}
            standing={cumulative.standing}
            hasData={hasData}
          />

          <View style={styles.statsRow}>
            <View style={styles.statTile}>
              <Text style={styles.statValue}>{semesters.length}</Text>
              <Text style={styles.statLabel}>
                {semesters.length === 1 ? 'Semester' : 'Semesters'}
              </Text>
            </View>
            <View style={styles.statTile}>
              <Text style={styles.statValue}>
                {cumulative.semesters.reduce(
                  (sum, s) => sum + s.outstandings.length,
                  0,
                )}
              </Text>
              <Text style={styles.statLabel}>Outstandings</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              label="Go to Calculator"
              onPress={() => navigation.navigate('Calculator')}
              style={styles.cta}
            />
            {hasData && (
              <PrimaryButton
                label="View Transcript"
                variant="outline"
                onPress={() => navigation.navigate('CGPAOutput')}
                style={[styles.cta, { marginTop: spacing.md }]}
              />
            )}
          </View>
        </ScrollView>
        <FeedbackModal
          visible={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  greeting: { ...typography.body, color: colors.whiteAlpha80 },
  title: { ...typography.h1, color: colors.white, marginTop: 4 },
  feedbackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackIcon: { color: colors.white, fontSize: 18 },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  statTile: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  statValue: { ...typography.h2, color: colors.white },
  statLabel: { ...typography.caption, color: colors.whiteAlpha80, marginTop: 2 },
  actions: { marginTop: spacing.xxl },
  cta: { width: '100%' },
});
