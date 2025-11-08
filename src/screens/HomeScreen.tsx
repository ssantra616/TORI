import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TORI</Text>
      <Text style={styles.subtitle}>VR/AI Tour Guide — skeleton</Text>
      <Button title="Tour" onPress={() => navigation.navigate("Tour")} />
      <Button title="People" onPress={() => navigation.navigate("People")} />
      <Button title="Settings" onPress={() => navigation.navigate("Settings")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 14, opacity: 0.7, marginBottom: 8 }
});
