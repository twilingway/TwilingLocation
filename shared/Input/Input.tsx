import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useState } from "react";
import EyeIcon from "../../assets/icons/eye.svg";
import EyeClosedIcon from "../../assets/icons/eye_closed.svg";

export function Input({
  isPassword,
  ...props
}: TextInputProps & { isPassword?: boolean }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <View>
      <TextInput
        style={styles.input}
        // placeholderTextColor={Colors.light.placeholderTextColor}
        secureTextEntry={isPassword && !isPasswordVisible}
        {...props}
        onBlur={() => setIsPasswordVisible(false)}
      />
      {isPassword && (
        <Pressable
          style={styles.eyeIconWrapper}
          onPress={() => setIsPasswordVisible((prev) => !prev)}
        >
          {isPasswordVisible ? (
            <EyeIcon fill="red" />
          ) : (
            <EyeClosedIcon fill="green" />
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 58,
    // backgroundColor: Colors.light.inputBackgroundColor,
    paddingHorizontal: 16,
    borderRadius: 12,
    // borderColor: Colors.light.text,
    borderWidth: 1,
    fontSize: 16,
  },
  eyeIconWrapper: {
    position: "absolute",
    right: 0,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
});
