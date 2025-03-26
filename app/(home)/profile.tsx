import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar } from "../../entities/user/ui/Avatar/Avatar";
import { ImageUploader } from "../../shared/ImageUploader/ImageUploader";
import { useAtom, useAtomValue } from "jotai";
import { updateProfileAtom } from "@/entities/user/model/user.state";
import { Button } from "@/shared/Button/Button";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { IUser } from "@/entities/user/model/user.model";
import { USER_API } from "@/entities/user/api/userApi";
import { authAtom } from "@/entities/auth/model/auth.state";

export default function Profile() {
  const [image, setImage] = useState<string | null>(null);
  const [profile, updateProfile] = useAtom(updateProfileAtom);
  const { accessToken } = useAtomValue(authAtom);
  useEffect(() => {
    if (profile && profile.user?.profile.photo) {
      setImage(profile.user?.profile.photo);
    }
  }, [profile]);

  const submitProfile = async () => {
    console.log("image :>> ", image);

    if (!image) {
      return;
    }
    updateProfile({ photo: image });
  };

  return (
    <View>
      <View style={styles.container}>
        <Avatar image={image} />

        <ImageUploader
          onUpload={setImage}
          onError={(e) => console.error("ImageUploader Error :>> ", e)}
        />
      </View>
      <Button disabled={!image} title="Сохранить" onPress={submitProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // flexWrap: "wrap",
    gap: 20,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
});
