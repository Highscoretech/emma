import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, gradient, typography } from '../theme/theme';
import { useAppStore } from '../store/appStore';
import { useSemesterStore } from '../store/semesterStore';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SPLASH_DURATION_MS = 1500;

export function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const hydrateApp = useAppStore((s) => s.hydrate);
  const hydrateSemesters = useSemesterStore((s) => s.hydrate);

  useEffect(() => {
    let cancelled = false;
    const minDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, SPLASH_DURATION_MS),
    );

    Promise.all([hydrateApp(), hydrateSemesters(), minDelay]).then(() => {
      if (cancelled) return;
      const { hasSeenOnboarding } = useAppStore.getState();
      navigation.reset({
        index: 0,
        routes: [{ name: hasSeenOnboarding ? 'Home' : 'Onboarding' }],
      });
    });

    return () => {
      cancelled = true;
    };
  }, [hydrateApp, hydrateSemesters, navigation]);

  return (
    <LinearGradient colors={gradient.primary} style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>CGPA Calculator</Text>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Track your academic performance</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.h1, color: colors.white },
  logo: {
    width: 120,
    height: 120,
    marginTop: 20,
    borderRadius: 28,
  },
  subtitle: { ...typography.body, color: colors.whiteAlpha80, marginTop: 20 },
});
