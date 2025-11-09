import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";


type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.actions}>
        <Text style={styles.header}>Hey! Welcome to Tori. How can we help you?</Text>
        <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate("Tour")}>
          <Text style={styles.primaryText}>Start Tour</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate("People")}>
          <Text style={styles.secondaryText}>Find People Nearby</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ghost} onPress={() => navigation.navigate("Settings")}>
          <Text style={styles.ghostText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const PURPLE = "#7B1EFF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 28
  },
  circle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 6
  },
  brand: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 2
  },
  header:{
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "700",
    marginBottom: 12,
    alignItems: "center",
    textAlign: "center",  
  },
  tagline: {
    color: "#EDEDED",
    letterSpacing: 1,
    fontSize: 13
  },
  actions: {
    width: "100%",
    gap: 12
  },
  primary: {
    backgroundColor: "#000000",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center"
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800"
  },
  secondary: {
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center"
  },
  secondaryText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "800"
  },
  ghost: {
    alignItems: "center",
    paddingVertical: 10
  },
  ghostText: {
    color: "#1F1F1F",
    textDecorationLine: "underline",
    fontWeight: "600"
  }
});
