import {
  ActivityIndicator,
  Animated,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
} from "react-native";
import { Colors } from "../../constants/Colors";

export function Button({
  title,
  isLoading,
  disabled,
  ...props
}: PressableProps & { title: string; isLoading?: boolean }) {
  const animatedValue = new Animated.Value(100);
  const color = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [Colors.light.primaryHover, Colors.light.primary],
  });

  const handleOnPressIn = (event: GestureResponderEvent) => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    props?.onPressIn?.(event);
  };

  const handleOnPressOut = (event: GestureResponderEvent) => {
    Animated.timing(animatedValue, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start();
    props?.onPressOut?.(event);
  };

  Animated.timing(animatedValue, {
    toValue: 100,
    duration: 2000,
    useNativeDriver: true,
  }).start();

  return (
    <Pressable
      {...props}
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}
      disabled={disabled}
    >
      <Animated.View
        style={{
          ...styles.button,
          backgroundColor: !disabled ? color : Colors.light.disableColor,
        }}
      >
        {isLoading && (
          <ActivityIndicator size="large" color={Colors.light.primary} />
        )}
        {!isLoading && <Text style={styles.text}>{title}</Text>}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    height: 58,
  },

  text: {
    fontSize: 18,
    color: Colors.light.text,
    paddingHorizontal: 8,
  },
});
