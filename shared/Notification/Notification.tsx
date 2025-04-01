import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export function Notification() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowAlert: true,
    }),
  });

  useEffect(() => {
    const subReceived = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("notification :>> ", notification);
        console.log(
          "subReceived notification data :>> ",
          notification.request.content.data
        );
      }
    );
    const subResponseReceived =
      Notifications.addNotificationResponseReceivedListener((notification) => {
        console.log("subResponse notification :>> ", notification);
      });
    return () => {
      subReceived.remove();
      subResponseReceived.remove();
    };
  }, []);

  return <></>;
}
