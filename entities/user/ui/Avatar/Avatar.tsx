import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image, StyleSheet } from "react-native";

export function Avatar({ image }: { image: string | null }) {
  return (
    <>
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.profileLogo}
          resizeMode="cover"
        />
      ) : (
        <FontAwesome6 name="user-circle" size={70} color="black" />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  profileLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});
