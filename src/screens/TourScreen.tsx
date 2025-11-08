import { View, Text, StyleSheet } from "react-native";
export default function TourScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tour Screen</Text>
      <Text>Placeholder for camera/AR city view.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold" }
});
