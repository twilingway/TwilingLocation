import { StyleSheet, View, Image, Text, Linking } from "react-native";

import MaskedView from "@react-native-masked-view/masked-view";

import { Chip } from "@/shared/Chip/Chip";
import { StudentCourseDescription } from "@/entities/course/model/course.model";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "@/shared/Button/Button";
import { Colors } from "@/constants/Colors";
import { CourseProgress } from "@/entities/course/ui/CourseProgress/CourseProgress";

export function CourseCard({
  image,
  shortTitle,
  courseOnDirection,
  alias,
  tariffs,
}: StudentCourseDescription) {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: image,
        }}
        style={styles.image}
        height={200}
      />
      <View style={styles.header}>
        <CourseProgress totalLessons={120} passedLessons={40} />
        <Text style={styles.title}>{shortTitle}</Text>
        <View style={styles.chips}>
          {courseOnDirection.length > 0 &&
            courseOnDirection.map((c) => (
              <Chip text={c.direction.name} key={c.direction.name} />
            ))}
        </View>
        <MaskedView
          maskElement={
            <Text style={styles.tariff}>
              Тариф &laquo;{tariffs[0].name}&raquo;
            </Text>
          }
        >
          <LinearGradient
            colors={["#D77BE5", "#6C38CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={{ ...styles.tariff, ...styles.tariffWithOpacity }}>
              Тариф &laquo;{tariffs[0].name}&raquo;
            </Text>
          </LinearGradient>
        </MaskedView>
      </View>
      <View style={styles.footer}>
        <Button
          title="Купить"
          onPress={() =>
            Linking.openURL(`https://purpleschool.ru/course/${alias}`)
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    borderRadius: 10,
    backgroundColor: Colors.light.background,
  },
  tariff: {
    marginTop: 10,
    fontSize: 16,
  },
  tariffWithOpacity: {
    opacity: 0,
  },
  image: {
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  title: {
    fontSize: 21,
    color: Colors.light.primary,

    marginBottom: 12,
  },
  chips: {
    flexDirection: "row",
    gap: 10,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  footer: {
    backgroundColor: Colors.light.backgroundItemActive,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
