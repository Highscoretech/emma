import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradient, radius, spacing, typography } from '../theme/theme';
import { useAppStore } from '../store/appStore';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

interface Slide {
  key: string;
  emoji: string;
  title: string;
  body: string;
}

const slides: Slide[] = [
  {
    key: 'track',
    emoji: '📚',
    title: 'Track Every Semester',
    body: 'Log your courses, units, and scores semester by semester — no spreadsheets needed.',
  },
  {
    key: 'aim',
    emoji: '🎯',
    title: 'Aim for First Class',
    body: 'See your academic standing at a glance and know what it takes to hit your target.',
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === slides.length - 1;

  const goToHome = async () => {
    await completeOnboarding();
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const handleNext = () => {
    if (isLast) {
      goToHome();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (newIndex !== index) setIndex(newIndex);
  };

  return (
    <LinearGradient colors={gradient.primary} style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          {!isLast && (
            <Pressable onPress={goToHome} hitSlop={12}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
          )}
        </View>

        <FlatList
          ref={listRef}
          data={slides}
          keyExtractor={(item) => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </View>
          )}
        />

        <View style={styles.dotsRow}>
          {slides.map((s, i) => (
            <View
              key={s.key}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.cta} onPress={handleNext}>
            <Text style={styles.ctaText}>
              {isLast ? 'Get Started' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  topBar: {
    height: 44,
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  skip: { ...typography.body, color: colors.whiteAlpha80 },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emoji: { fontSize: 96, marginBottom: spacing.xl },
  title: {
    ...typography.h1,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    ...typography.body,
    color: colors.whiteAlpha80,
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.whiteAlpha70,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  dotActive: { opacity: 1, width: 24 },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  cta: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  ctaText: { ...typography.button, color: colors.primary },
});
