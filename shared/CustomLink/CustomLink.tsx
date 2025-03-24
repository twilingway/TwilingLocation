import { Link, LinkProps } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { Colors } from "../../constants/Colors";

export function CustomLink({ text, ...props }: LinkProps & { text: string }) {
  return (
    <Link style={styles.link} {...props}>
      <Text>{text}</Text>
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 18,
    color: Colors.light.tint,
  },
});
