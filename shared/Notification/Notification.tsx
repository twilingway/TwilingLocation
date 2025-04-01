import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export function Notification() {
  const router = useRouter();

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
        const alias = notification.notification.request.content.data.alias;
        router.push(`/(home)/course/${alias}`);
      });
    return () => {
      subReceived.remove();
      subResponseReceived.remove();
    };
  }, []);

  return <></>;
}
