import { Redirect, SplashScreen } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useAtomValue } from "jotai";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BurgerIcon from "../../assets/icons/burger.svg";
import { Colors } from "../../constants/Colors";
import { authAtom } from "../../entities/auth/model/auth.state";
import { CustomDrawer } from "../../widget/layout/ui/CustomDrawer/CustomDrawer";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { accessToken } = useAtomValue(authAtom);

  //   const insets = useSafeAreaInsets();

  //   useEffect(() => {
  //     SplashScreen.preventAutoHideAsync();

  //     // Инициализация приложения
  //     setTimeout(() => {
  //       SplashScreen.hideAsync();
  //     }, 2000);
  //   }, []);

  if (!accessToken) {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <Drawer
        drawerContent={(props: any) => <CustomDrawer {...props} />}
        screenOptions={({ navigation }: any) => ({
          headerStyle: {
            backgroundColor: Colors.light.tint,
            shadowOpacity: 0,
            shadowColor: Colors.light.tint,
            // height: 100,
          },
          headerLeft: () => (
            <View
              style={
                {
                  // padding: 18,
                  // alignItems: "center",
                  // justifyContent: "center",
                  // flex: 1,
                }
              }
            >
              <BurgerIcon
                onPress={() => navigation.toggleDrawer()}
                style={styles.burger}
              />
            </View>
          ),
          headerTitleStyle: {
            color: Colors.light.text,
            fontFamily: "FiraSans",
            fontSize: 20,
          },
          headerTitleAlign: "center",
          sceneStyle: {
            // backgroundColor: Colors.light.placeholderTextColor,
          },
          // drawerContentStyle: {
          //   backgroundColor: Colors.light.placeholderTextColor,
          // },
        })}
      >
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            // drawerLabel: "Home",
            title: "Карта",
          }}
        />
        <Drawer.Screen
          name="profile" // This is the name of the page and must match the url from root
          options={{
            // drawerLabel: "Home",
            title: "Профиль",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
    // <SafeAreaProvider>
    //   <Stack>
    //     <Stack.Screen name="index" />
    //   </Stack>
    // </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  burger: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginLeft: 16,
    flex: 1,
  },
});
