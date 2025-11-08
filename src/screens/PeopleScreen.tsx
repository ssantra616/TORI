import { View, Text, StyleSheet } from "react-native";
export default function PeopleScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>People Screen</Text>
      <Text>Placeholder for matching users with similar backgrounds.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold" }
});
