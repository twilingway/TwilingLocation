import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import axios, { AxiosError } from "axios";
import {
  launchImageLibraryAsync,
  PermissionStatus,
  useMediaLibraryPermissions,
} from "expo-image-picker";
import { openSettings } from "expo-linking";
import FormData from "form-data";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { FILE_API } from "../constants/api";
import { IUploadResponse } from "./ImageUploader.interface";

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  onError?: (error: string) => void;
}

export function ImageUploader({ onUpload, onError }: ImageUploaderProps) {
  const [libraryPermissions, requestLibraryPermissions] =
    useMediaLibraryPermissions();

  const pickImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: ["images", "livePhotos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.assets) {
      return null;
    }

    return result.assets[0];
  };

  const verifyMediaPermissions = async () => {
    if (libraryPermissions?.status === PermissionStatus.UNDETERMINED) {
      const res = await requestLibraryPermissions();
      return res.granted;
    }
    if (libraryPermissions?.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Ошибка доступа к галереи!",
        "Пожалуйста, предоставьте разрешение в настройках.",
        [
          {
            text: "Отмена", // Текст кнопки
            onPress: () => console.log("Пользователь нажал Отмена"), // Обработчик нажатия
            style: "cancel", // Стиль кнопки (необязательно)
          },
          {
            text: "Перейти в настройки", // Текст кнопки
            onPress: openSettings, // Обработчик нажатия
          },
        ],
        { cancelable: true } // Опционально: позволяет закрыть Alert нажатием вне его
      );

      return false;
    }
    return true;
  };

  const uploadToServer = async (uri: string, name: string) => {
    const formData = new FormData();
    formData.append("files", {
      uri,
      name,
      type: "image/jpeg",
    });
    try {
      console.log(" FILE_API.uploadImage, :>> ", FILE_API.uploadImage);
      const { data } = await axios.post<IUploadResponse>(
        FILE_API.uploadImage,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("uploadToServer :>> ", data);
      return data.urls.original;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("upload error :>> ", error);
      }
      return null;
    }
  };

  const upload = async () => {
    const isPermissionGranted = await verifyMediaPermissions();
    if (!isPermissionGranted) {
      onError?.("недостаточно прав");
      return;
    }
    const asset = await pickImage();
    if (!asset) {
      onError?.("Не удалось выбрать изображение");
      return;
    }
    const uploadedUrl = await uploadToServer(asset.uri, asset.fileName ?? "");
    if (!uploadedUrl) {
      onError?.("Не удалось загрузить изображение");
      return;
    }
    onUpload(uploadedUrl);
  };

  return (
    <Pressable onPress={upload}>
      <View style={styles.container}>
        <SimpleLineIcons name="cloud-upload" size={24} color="black" />
        <Text style={styles.text}>Загрузить изображение</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: Colors.light.inputBackgroundColor,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  text: {
    fontSize: 14,
  },
});
