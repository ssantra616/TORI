import { View, Text, StyleSheet } from "react-native";
export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text>Placeholder for app preferences.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold" }
});
