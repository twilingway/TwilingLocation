import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar } from "../../entities/user/ui/Avatar/Avatar";
import { ImageUploader } from "../../shared/ImageUploader/ImageUploader";

export default function Profile() {
  const [image, setImage] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Avatar image={image} />

      <ImageUploader
        onUpload={setImage}
        onError={(e) => console.error("ImageUploader Error :>> ", e)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
});
