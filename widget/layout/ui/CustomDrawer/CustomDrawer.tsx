import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Image, StyleSheet, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Colors } from "../../../../constants/Colors";
import { logoutAtom } from "../../../../entities/auth/model/auth.state";
import { MenuItem } from "../../../../entities/layout/ui/MenuItem/MenuItem";
import { loadUserProfileAtom } from "../../../../entities/user/model/user.state";
import { CustomLink } from "../../../../shared/CustomLink/CustomLink";
import { UserMenu } from "../../../user/ui/UserMenu/UserMenu";
import cargps from "../../../../assets/images/cargps.png";

const MENU = [
  {
    text: "Карта",
    icon: <Ionicons name="close-circle-outline" size={50} color="" />,
    path: "index",
  },
  {
    text: "Профиль",
    icon: <Ionicons name="close-circle-outline" size={50} color="" />,
    path: "profile",
  },
  {
    text: "Курсы",
    icon: <Ionicons name="close-circle-outline" size={50} color="" />,
    path: "courses",
  },
];

export function CustomDrawer(props: DrawerContentComponentProps) {
  const logout = useSetAtom(logoutAtom);
  const [user, loadProfile] = useAtom(loadUserProfileAtom);

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.scrollView}
      // style={{ paddingStart: 0, paddingEnd: 0, padding: 0 }}
    >
      {/* <Ionicons
        name="close-circle-outline"
        size={50}
        color=""
        onPress={() => props.navigation.closeDrawer()}
        style={styles.iconClose}
      /> */}
      <View style={styles.content}>
        <Ionicons
          name="close-circle-outline"
          size={50}
          color=""
          onPress={() => props.navigation.closeDrawer()}
          style={styles.iconClose}
        />
        <UserMenu profile={user.user?.profile} />
        {MENU.map((menu) => (
          <MenuItem key={menu.path} {...menu} drawer={props} />
        ))}
      </View>
      <View style={styles.footer}>
        <CustomLink text="Выход" href={"/login"} onPress={() => logout()} />
        <View style={styles.footerLogo}>
          <Image source={cargps} style={styles.logo} resizeMode="cover" />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
    paddingStart: 0,
    paddingEnd: 0,
  },
  logo: {
    width: 100,
    height: 100,
  },
  iconClose: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    right: 0,
  },
  content: {
    flex: 1,
    padding: 0,
    paddingStart: 0,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
  },
  footerLogo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
