import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Actions">;

export default function ActionsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose an action</Text>
        <Text style={styles.subtitle}>Where should Tori guide you?</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate("Tour")}>
          <Text style={styles.primaryText}>Start Tour</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate("People")}>
          <Text style={styles.secondaryText}>Find People Nearby</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate("Settings")}>
          <Text style={styles.linkText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const PURPLE = "#7B1EFF";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PURPLE, padding: 24, justifyContent: "center" },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "900", color: "#FFFFFF" },
  subtitle: { fontSize: 14, color: "#EDEDED", marginTop: 6 },
  buttons: { gap: 14 },
  primary: { backgroundColor: "#000000", paddingVertical: 16, borderRadius: 16, alignItems: "center" },
  primaryText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  secondary: { backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: "#000000", paddingVertical: 16, borderRadius: 16, alignItems: "center" },
  secondaryText: { color: "#000000", fontSize: 16, fontWeight: "800" },
  link: { alignItems: "center", paddingVertical: 10 },
  linkText: { color: "#1F1F1F", textDecorationLine: "underline", fontWeight: "600" }
});
