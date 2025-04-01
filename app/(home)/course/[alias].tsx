import {
  courseAtom,
  loadCourseAtom,
} from "@/entities/course/model/course.state";
import { useLocalSearchParams } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function CoursePage() {
  const { alias } = useLocalSearchParams();
  console.log("alias :>> ", alias);
  const { isLoading, error, courses } = useAtomValue(courseAtom);
  const loadCourse = useSetAtom(loadCourseAtom);

  // console.log("courses :>> ", courses);
  useEffect(() => {
    loadCourse();
  }, []);

  return (
    <View>
      <Text>Страница курса {alias}</Text>
      {courses && courses.other.map((c) => <Text key={c.id}>{c.title}</Text>)}
    </View>
  );
}
