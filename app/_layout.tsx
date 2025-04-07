import { Stack } from "expo-router";
// import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  // const [loaded] = useFonts({
  //   SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  // });

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

// return (
//   <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//     <Notification />
//     <Stack
//       screenOptions={{
//         //   statusBarBackgroundColor: Colors.dark.background,

//         contentStyle: {
//           backgroundColor: Colors.light.background,
//           // paddingTop: insets.top,
//         },
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen name="(home)" />
//       <Stack.Screen name="login" />
//       <Stack.Screen
//         name="restore"
//         options={{
//           presentation: "modal",
//         }}
//       />
//       <Stack.Screen name="+not-found" />
//     </Stack>
//     <StatusBar style="auto" />
//   </ThemeProvider>
// );
