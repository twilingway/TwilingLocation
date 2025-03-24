import { DrawerContentComponentProps } from "@react-navigation/drawer/lib/typescript/commonjs/src/types";
import { ReactNode, useState } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../../../../constants/Colors";

interface IMenuItemProps {
  drawer: DrawerContentComponentProps;
  icon: ReactNode;
  text: string;
  path: string;
}

export function MenuItem({
  drawer,
  icon,
  path,
  text,
  ...props
}: IMenuItemProps & PressableProps) {
  const [clicked, setClicked] = useState<boolean>(false);
  //   console.log("drawer.state :>> ", drawer.state);
  //   console.log("object :>> ", drawer.state.routes[drawer.state.index].name);
  const isActive = drawer.state.routes[drawer.state.index].name === path;

  return (
    <Pressable
      {...props}
      onPress={() => drawer.navigation.navigate(path)}
      onPressIn={() => setClicked(true)}
      onPressOut={() => setClicked(false)}
    >
      <View
        style={{
          ...styles.item,
          backgroundColor:
            clicked || isActive
              ? Colors.light.backgroundItemActive
              : Colors.light.background,
          borderColor: isActive
            ? Colors.light.primary
            : Colors.light.background,
        }}
      >
        {icon}
        <Text style={styles.text}>{text}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRightWidth: 4,
    paddingStart: 16,
  },
  text: {},
});
