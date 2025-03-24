/* eslint-disable react-native/no-unused-styles */
import { useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text } from "react-native";
import { INotificationProps } from "./Notification.props";

export function Notification({ message, type = "error" }: INotificationProps) {
  const [isShown, setIsShown] = useState<boolean>(false);

  const animatedValue = new Animated.Value(-100);

  const handleLayout = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (!message) {
      return;
    }
    setIsShown(true);

    const timerId = setTimeout(() => {
      setIsShown(false);
    }, 3000);

    return () => clearTimeout(timerId);
  }, [message]);

  if (!isShown) {
    return <></>;
  }

  return (
    <Animated.View
      style={[
        {
          ...style.notificationWrapper,
          transform: [{ translateY: animatedValue }],
        },
        style[type],
      ]}
      onLayout={handleLayout}
    >
      <Text style={style.message}>{message}</Text>
    </Animated.View>
  );
}

const style = StyleSheet.create({
  notificationWrapper: {
    position: "absolute",
    top: 50,
    width: Dimensions.get("screen").width,
    padding: 16,
    zIndex: 100,
  },

  error: {
    backgroundColor: "red",
  },
  success: {},
  info: {},
  warning: {},
  message: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
});
