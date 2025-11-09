import { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";



export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const t = setTimeout(() => navigation.replace("Actions"), 10000);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.circle}>
         <Image
       source={require("../../assets/tori_logo.png")}
       style={styles.logo}
       />
      </View>
    </SafeAreaView>
  );
}

const PURPLE = "#7B1EFF";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PURPLE, alignItems: "center", justifyContent: "center" },
  circle: { width: 320, height: 320, borderRadius: 160, backgroundColor: "#000000", alignItems: "center", justifyContent: "center", padding: 24 },
  logo: { width: 180, height: 180, resizeMode: "contain", marginBottom: 8 },
  title: { fontSize: 48, fontWeight: "800", color: "#FFFFFF", marginBottom: 4 },
  tagline: { fontSize: 14, letterSpacing: 2, color: "#EDEDED" }
});
