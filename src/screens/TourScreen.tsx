import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, SafeAreaView, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import MapView, { PROVIDER_DEFAULT, Region } from "react-native-maps";
import * as Location from "expo-location";

export default function TourScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
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
      // —— Gemini text stub (swap with Live later) ——
      // put your key in an env or secure store; hardcoding here for demo is NOT recommended
      const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `I'm at ${region?.latitude}, ${region?.longitude}. User asked: "${query}". Suggest the best nearby destination (name + short reason) and a simple walking route summary.` }] }],
          }),
        }
      );
      const data = await resp.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I’ll find a great place near you!";
      alert(text);
      // (Optional next step) geocode the suggestion -> center map to destination -> draw route
    } catch (e) {
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
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
        style={styles.bottomWrap}
      >
        <SafeAreaView style={styles.bottomCard}>
          <Text style={styles.promptTitle}>Where do you want to be guided to by Tori?</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Type a place, landmark, café…"
            placeholderTextColor="#A8A8A8"
            style={styles.input}
            returnKeyType="go"
            onSubmitEditing={askTori}
          />
          <TouchableOpacity onPress={askTori} style={styles.goBtn} disabled={thinking}>
            <Text style={styles.goText}>{thinking ? "Thinking…" : "Guide me"}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const PURPLE = "#7B1EFF";

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#000" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  bottomWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
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
});
