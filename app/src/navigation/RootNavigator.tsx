import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CalculatorScreen } from '../screens/CalculatorScreen';
import { GradeEntryScreen } from '../screens/GradeEntryScreen';
import { CGPAOutputScreen } from '../screens/CGPAOutputScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
        <Stack.Screen name="GradeEntry" component={GradeEntryScreen} />
        <Stack.Screen name="CGPAOutput" component={CGPAOutputScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
