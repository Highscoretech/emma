export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Home: undefined;
  Calculator: undefined;
  GradeEntry: { semesterId?: string } | undefined;
  CGPAOutput: { semesterId?: string } | undefined;
};
