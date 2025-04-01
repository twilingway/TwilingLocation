import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAtomValue, useSetAtom } from "jotai";

import { useCallback, useEffect } from "react";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import {
  courseAtom,
  loadCourseAtom,
} from "@/entities/course/model/course.state";
import { CourseCard } from "@/widget/course/ui/Course";
import { StudentCourseDescription } from "@/entities/course/model/course.model";
import { Button } from "@/shared/Button/Button";
import { Colors } from "@/constants/Colors";

export default function MyPhysics() {
  const { isLoading, courses } = useAtomValue(courseAtom);
  const loadCourse = useSetAtom(loadCourseAtom);

  useEffect(() => {
    loadCourse();
  }, []);

  const renderCourse = useCallback(
    ({ item }: { item: StudentCourseDescription }) => {
      return (
        <View style={styles.item}>
          <CourseCard {...item} />
        </View>
      );
    },
    []
  );

  const allowsNotification = async () => {
    const settings = await Notifications.getPermissionsAsync();
    return (
      settings.granted ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    );
  };

  const requestPermissions = async () => {
    return Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
  };

  const scheduleNotification = async () => {
    const granted = await allowsNotification();
    console.log("granted :>> ", granted);
    if (!granted) {
      await requestPermissions();
    }
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Новый курс Typescript",
        body: "Начни учиться уже сейчас!",
        data: { success: true, alias: "typescript" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
      },
    });
    if (Device.isDevice) {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });
      console.log("scheduleNotification", token);
    }
  };

  return (
    <>
      {isLoading && (
        <ActivityIndicator
          style={styles.activity}
          size="large"
          color={Colors.light.primary}
        />
      )}
      <Button title="Напомнить" onPress={scheduleNotification} />
      {courses && courses.other.length > 0 && (
        <FlatList
          refreshControl={
            <RefreshControl
              tintColor={Colors.light.primary}
              titleColor={Colors.light.primary}
              refreshing={isLoading}
              onRefresh={loadCourse}
            />
          }
          data={courses.other}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderCourse}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
  },
  activity: {
    marginTop: 30,
  },
});
