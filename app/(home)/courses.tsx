import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CoursesPage() {
  const courses = [
    { alias: "math", title: "Математика" },
    { alias: "physics", title: "Физика" },
    { alias: "chemistry", title: "Химия" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Список курсов</Text>
      {courses.map((course) => (
        <TouchableOpacity
          key={course.alias}
          style={styles.courseButton}
          onPress={() => router.push(`/course/${course.alias}`)}
        >
          <Text style={styles.courseButtonText}>{course.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  courseButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  courseButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
