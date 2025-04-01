import { Colors } from "@/constants/Colors";
import { View, Text, StyleSheet } from "react-native";

export function Chip({ text }: { text: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: Colors.light.primary,
    borderRadius: 17,
    borderWidth: 1,
  },
  text: {
    // fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.light.text,
  },
});
