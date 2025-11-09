import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import * as Speech from "expo-speech";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Haversine distance in meters
function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  return 2 * R * Math.asin(Math.sqrt(h));
}

type Stop = {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
};

export default function ToriMain() {
  const [input, setInput] = useState("");
  const [lastUser, setLastUser] = useState<string | null>(null);
  const [toriReply, setToriReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [visitedStops, setVisitedStops] = useState<Record<string, boolean>>({});

  // 🔹 1) Get location + create demo stops near user
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Location permission not granted, using demo path.");
          // Demo-only fallback
          setStops([
            {
              id: "demo-1",
              name: "Demo Spot",
              description: "Example location to show how Tori reacts.",
              lat: 0,
              lng: 0,
            },
          ]);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const here = { lat, lng };
        setUserLocation(here);

        // Simple 3-stop path around the user
        const demoStops: Stop[] = [
          {
            id: "spot-1",
            name: "Starting Point",
            description: "A good first place to pause and notice your surroundings.",
            lat: lat + 0.0005,
            lng,
          },
          {
            id: "spot-2",
            name: "Lookout",
            description: "A nearby point where Tori might point something out.",
            lat,
            lng: lng + 0.0005,
          },
          {
            id: "spot-3",
            name: "Quiet Corner",
            description: "A slightly tucked-away spot to reflect or meet someone.",
            lat: lat - 0.0005,
            lng: lng - 0.0003,
          },
        ];

        setStops(demoStops);

        // Start watching movement for proximity triggers
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 4000,
            distanceInterval: 5,
          },
          (update) => {
            const cur = {
              lat: update.coords.latitude,
              lng: update.coords.longitude,
            };
            setUserLocation(cur);
            handleProximity(cur, demoStops);
          }
        );
      } catch (err) {
        console.warn("Location error", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 2) Handle proximity → auto Tori message
  function handleProximity(current: { lat: number; lng: number }, stopsList: Stop[]) {
    if (!current || !stopsList.length || loading) return;

    const THRESHOLD = 40; // meters
    const newlyReached: Stop[] = [];

    for (const stop of stopsList) {
      if (visitedStops[stop.id]) continue;
      const d = distanceMeters(current, { lat: stop.lat, lng: stop.lng });
      if (d <= THRESHOLD) newlyReached.push(stop);
    }

    if (!newlyReached.length) return;

    setVisitedStops((prev) => {
      const copy = { ...prev };
      newlyReached.forEach((s) => {
        copy[s.id] = true;
      });
      return copy;
    });

    // Have Tori greet at the first newly reached stop
    const stop = newlyReached[0];
    const autoPrompt = `I'm at "${stop.name}". ${stop.description} Greet me as Tori and suggest one short thing to notice or do here.`;
    askTori(autoPrompt, { isAuto: true });
  }

  // 🔹 3) Call Gemini (Tori's brain)
  async function askTori(message: string, opts?: { isAuto?: boolean }) {
    const userText = (message || input).trim();
    if (!userText || loading) return;

    if (!GEMINI_API_KEY) {
      setToriReply("I’m not wired up yet—missing GEMINI_API_KEY.");
      return;
    }

    setLoading(true);
    setInput("");

    if (!opts?.isAuto) {
      setLastUser(userText);
    } else {
      setLastUser(null); // keep focus on Tori for auto events
    }

    const systemInstruction = `
You are Tori, a shared, location-aware tour companion.
Tone: warm, playful, concise (1–3 sentences).
You help people notice cool details about where they are and feel more connected.
Assume multiple people may be listening; address "you all" sometimes.
Avoid heavy topics; keep it light and campus/city friendly.
`.trim();

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemInstruction },
                  { text: `User: ${userText}` },
                  { text: "Respond as Tori in one short, vivid reply." },
                ],
              },
            ],
          }),
        }
      );

      if (!res.ok) {
        console.warn("Gemini error:", await res.text());
        setToriReply("I got a bit scrambled—can you try that again?");
        return;
      }

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "I’m here with you; try asking that one more time.";

      setToriReply(text);
      speakTori(text);
    } catch (err) {
      console.warn("Tori error:", err);
      setToriReply("Something glitched on my side—mind trying once more?");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 4) Tori's voice (Expo Speech for now)
  function speakTori(text: string) {
    // Simple, works on iOS/Android via system voices.
    Speech.stop();
    Speech.speak(text, {
      rate: 1.0,
      pitch: 1.02,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/tori_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.title}>Tori</Text>
          <Text style={styles.subtitle}>Shared AR Tour Guide</Text>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Text style={styles.helper}>
          Tori is one guide that everyone can bump into. She reacts to where you
          are, suggests things to notice, and can be shared across devices.
        </Text>

        {/* Itinerary card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your location-aware path (demo):</Text>
          {!userLocation && (
            <Text style={styles.cardText}>
              Waiting for location or using a demo path…
            </Text>
          )}
          {stops.map((s) => (
            <Text key={s.id} style={styles.cardText}>
              • {s.name}{" "}
              {visitedStops[s.id] ? "✅ (Tori greeted here)" : ""}
            </Text>
          ))}
          <Text style={[styles.cardText, { marginTop: 4 }]}>
            As you move near these spots, Tori can automatically greet you and
            suggest something to explore.
          </Text>
        </View>

        {/* Chat history */}
        <View style={styles.chatBox}>
          {lastUser && (
            <View style={[styles.bubble, styles.bubbleUser]}>
              <Text style={styles.bubbleLabel}>You</Text>
              <Text style={styles.bubbleText}>{lastUser}</Text>
            </View>
          )}
          {toriReply && (
            <View style={[styles.bubble, styles.bubbleTori]}>
              <Text style={styles.bubbleLabel}>Tori</Text>
              <Text style={styles.bubbleText}>{toriReply}</Text>
            </View>
          )}
          {loading && (
            <View style={[styles.bubble, styles.bubbleTori]}>
              <Text style={styles.bubbleLabel}>Tori</Text>
              <Text style={styles.bubbleText}>Thinking with you…</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Input row */}
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask Tori something about this place..."
          placeholderTextColor="#6B7280"
          style={styles.input}
          editable={!loading}
          onSubmitEditing={() => askTori(input)}
        />
        <TouchableOpacity
          onPress={() => askTori(input)}
          disabled={loading}
          style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.sendLabel}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020817" },
  header: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { width: 40, height: 40, marginRight: 10 },
  title: { fontSize: 20, fontWeight: "700", color: "#E5E7EB" },
  subtitle: { fontSize: 12, color: "#9CA3AF" },
  body: { flex: 1, paddingHorizontal: 16, marginTop: 6 },
  helper: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#020817",
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#111827",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  chatBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#111827",
    padding: 10,
    marginTop: 4,
    gap: 6,
    minHeight: 70,
    backgroundColor: "#020817",
  },
  bubble: {
    padding: 8,
    borderRadius: 12,
    maxWidth: "85%",
  },
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: "#111827",
  },
  bubbleTori: {
    alignSelf: "flex-start",
    backgroundColor: "#111827",
  },
  bubbleLabel: {
    fontSize: 9,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: 13,
    color: "#E5E7EB",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#111827",
    backgroundColor: "#020817",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#020817",
    borderWidth: 1,
    borderColor: "#374151",
    color: "#E5E7EB",
    fontSize: 13,
  },
  sendBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#2563EB",
  },
  sendBtnDisabled: {
    backgroundColor: "#6B7280",
  },
  sendLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
});

// import { View, Text, StyleSheet } from "react-native";
// export default function TourScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Tour Screen A</Text>
//       <Text>Placeholder for camera/AR city view.</Text>
//     </View>
//   ); 
// }
// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, gap: 8, justifyContent: "center" },
//   title: { fontSize: 20, fontWeight: "bold" }
// });
