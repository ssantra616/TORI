import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from "react-native";
import MapView, { PROVIDER_DEFAULT, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { Image } from "react-native";

export default function TourScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mapRef = useRef<MapView | null>(null);

  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [thinking, setThinking] = useState(false);

  // Drawer state
  const MENU_WIDTH = 280;
  const [menuVisible, setMenuVisible] = useState(false);
  const slideX = useRef(new Animated.Value(-MENU_WIDTH)).current;

  function openMenu() {
    setMenuVisible(true);
    Animated.timing(slideX, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }
  function closeMenu() {
    Animated.timing(slideX, {
      toValue: -MENU_WIDTH,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => finished && setMenuVisible(false));
  }
  function goHome() {
    closeMenu();
    navigation.navigate("Actions"); // your Actions screen
  }
  function createItinerary() {
    closeMenu();
    navigation.navigate("Itinerary");
  }

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const r: Region = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      };
      setRegion(r);
      setLoading(false);
      setTimeout(() => mapRef.current?.animateToRegion(r, 800), 50);
    })();
  }, []);

  async function askTori() {
    if (!query.trim()) return;
    setThinking(true);
    try {
      const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `I'm at ${region?.latitude}, ${region?.longitude}. User asked: "${query}". Suggest the best nearby destination (name + short reason) and a simple walking route summary.`,
                  },
                ],
              },
            ],
          }),
        }
      );
      const data = await resp.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I’ll find a great place near you!";
      alert(text);
    } catch {
      alert("Tori had trouble connecting. Try again.");
    } finally {
      setThinking(false);
    }
  }

  if (loading || !region) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Locating you…</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.wrap}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        showsUserLocation
        followsUserLocation
        initialRegion={region}
        onRegionChangeComplete={(r) => setRegion(r)}
      />

      {/* Top overlay: hamburger above the map */}
      <View pointerEvents="box-none" style={styles.topOverlay}>
        <SafeAreaView pointerEvents="box-none">
          <Pressable onPress={openMenu} hitSlop={12} style={styles.hamburgerBtn}>
            <View style={styles.bar} />
            <View style={[styles.bar, { width: 18 }]} />
            <View style={[styles.bar, { width: 14 }]} />
          </Pressable>
        </SafeAreaView>
      </View>

      {/* Bottom-right bot sticker (doesn't block touches) */}
      <View style={styles.botWrapper} pointerEvents="none">
        <Image
        source={require("../../assets/Tori-visual.png")}
        style={styles.botCorner}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => alert("Hi! I’m Tori — your VR tour companion! 💜")}
        style={styles.botWrapper}
      >
        <Image
          source={require("../../assets/Tori-visual.png")}
          style={styles.botCorner}
        />
      </TouchableOpacity>

        

      {/* Scrim + Drawer */}
      {menuVisible && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.scrim} />
        </TouchableWithoutFeedback>
      )}
      <Animated.View
        pointerEvents={menuVisible ? "auto" : "none"}
        style={[styles.drawer, { transform: [{ translateX: slideX }] }]}
      >
        <Text style={styles.drawerTitle}>Tori Menu</Text>

        <TouchableOpacity style={styles.drawerItem} onPress={createItinerary}>
          <Text style={styles.drawerItemText}>Create Itinerary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={goHome}>
          <Text style={styles.drawerItemText}>Home</Text>
          <Text style={styles.drawerItemSub}>Back to Actions</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const PURPLE = "#7B1EFF";

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#000" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },

  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 100,
  },
  hamburgerBtn: {
    marginLeft: 12,
    marginTop: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  bar: {
    height: 3,
    width: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    marginVertical: 2,
  },

  bottomWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  bottomCard: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 10,
  },
  goBtn: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  goText: { color: "#FFF", fontWeight: "800", fontSize: 16 },

  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 30,
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    paddingTop: Platform.select({ ios: 54, android: 44 }),
    paddingHorizontal: 16,
    backgroundColor: "#2B0060", // purple-tinted drawer
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.08)",
    zIndex: 40,
  },
  drawerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  drawerItem: {
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  drawerItemText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  drawerItemSub: {
    color: "#D1C4FF",
    fontSize: 12,
    marginTop: 2,
  },

  botWrapper: {
  position: "absolute",
  right: 16,
  bottom: 140, // adjust to float above your white card
  zIndex: 25,
  elevation: 10,
  },
  
  botCorner: {
  position: "absolute",
  right: 16,
  // keep it above the map but clear of the white bottom card
  bottom: 140,               // tweak to sit just above your input card
  width: 96,
  height: 96,
  resizeMode: "contain",
  zIndex: 20,
  // subtle lift
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 8,
},
});
