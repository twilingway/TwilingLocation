import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function CoursePage() {
  const { alias } = useLocalSearchParams();

  return (
    <View>
      <Text>Страница курса {alias}</Text>
    </View>
  );
}
