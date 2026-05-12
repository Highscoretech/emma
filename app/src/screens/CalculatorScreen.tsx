import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing, typography } from '../theme/theme';
import { useSemesterStore } from '../store/semesterStore';
import { SemesterCard } from '../components/SemesterCard';
import { AddSemesterModal } from '../components/AddSemesterModal';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Calculator'>;

export function CalculatorScreen() {
  const navigation = useNavigation<Nav>();
  const semesters = useSemesterStore((s) => s.semesters);
  const addSemester = useSemesterStore((s) => s.addSemester);
  const [modalOpen, setModalOpen] = useState(false);

  const sorted = [...semesters].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.title}>My Semesters</Text>
        <View style={{ width: 32 }} />
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SemesterCard
            semester={item}
            onPress={() =>
              navigation.navigate('GradeEntry', { semesterId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📘</Text>
            <Text style={styles.emptyTitle}>No semesters yet</Text>
            <Text style={styles.emptyBody}>
              Add your first semester to start tracking your CGPA.
            </Text>
          </View>
        }
      />

      <Pressable
        style={styles.fab}
        onPress={() => setModalOpen(true)}
        accessibilityLabel="Add semester"
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>

      <AddSemesterModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={async (data) => {
          const created = await addSemester(data);
          setModalOpen(false);
          navigation.navigate('GradeEntry', { semesterId: created.id });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: { width: 32, alignItems: 'flex-start' },
  backIcon: {
    fontSize: 32,
    color: colors.primary,
    lineHeight: 32,
    fontWeight: '300',
  },
  title: { ...typography.h2, color: colors.text },
  list: { padding: spacing.lg, paddingBottom: 100 },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  emptyBody: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 36,
  },
});
