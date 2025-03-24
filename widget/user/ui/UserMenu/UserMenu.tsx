import { StyleSheet, Text, View } from "react-native";
import { IProfileUser } from "../../../../entities/user/model/user.model";
import { Avatar } from "../../../../entities/user/ui/Avatar/Avatar";

export function UserMenu({ profile }: { profile: IProfileUser | undefined }) {
  if (!profile) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Avatar image={profile?.photo ?? null} />
      <Text style={styles.name}>{profile?.name}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
    marginTop: 32,
  },
  name: {
    fontSize: 24,
  },
});
