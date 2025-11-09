import React, { useState, useEffect } from "react";
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
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location"; // NEW: Import Location library

// ... (API keys and helper functions are unchanged)
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const ELEVEN_API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
const ELEVEN_VOICE_ID = process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    if (typeof btoa !== "undefined") {
        return btoa(binary);
    }
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    let i = 0;
    while (i < binary.length) {
        const c1 = binary.charCodeAt(i++);
        const c2 = binary.charCodeAt(i++);
        const c3 = binary.charCodeAt(i++);
        const e1 = c1 >> 2;
        const e2 = ((c1 & 3) << 4) | (c2 >> 4);
        const e3 = isNaN(c2) ? 64 : ((c2 & 15) << 2) | (c3 >> 6);
        const e4 = isNaN(c2) || isNaN(c3) ? 64 : c3 & 63;
        output +=
        chars.charAt(e1) +
        chars.charAt(e2) +
        chars.charAt(e3) +
        chars.charAt(e4);
    }
    return output;
}

export default function ToriMain() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { from: "user" | "tori"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  // NEW: State for location data and errors
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);


  useEffect(() => {
    // NEW: Asynchronous function to handle permissions and fetching
    (async () => {
      // Request camera permission
      if (Platform.OS !== "web") {
        await requestCameraPermission();
      }

      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationErrorMsg('Permission to access location was denied');
        return;
      }

      // Fetch the location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);


  // ... (handleSend is unchanged)
   async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { from: "user", text }]);
    await askTori(text);
  }

  // MODIFIED: askTori now includes location context
  async function askTori(userText: string) {
    if (!GEMINI_API_KEY) {
      const fallback =
        "I’m almost ready, but my AI brain isn’t wired up yet (missing GEMINI_API_KEY).";
      pushToriMessage(fallback);
      await speakTori(fallback);
      return;
    }

    setLoading(true);

    // NEW: Add location context to the system prompt if available
    const locationContext = location
      ? `The user's current location is latitude ${location.coords.latitude} and longitude ${location.coords.longitude}. Use this as a frame of reference for any location-based questions.`
      : "The user's location is not available.";

    const systemInstruction = `
You are Tori, a communal, friendly AI tour companion.
You are not a personal assistant; you are a shared presence people can "bump into".
Tone: warm, playful, concise (1–3 sentences), vivid.
You help people explore spaces, notice interesting details, feel welcome, and imagine ways to connect.
${locationContext} 
Assume others might also be listening/nearby; occasionally use inclusive language ("you all", "anyone nearby").
Avoid heavy topics; keep it light, supportive, curious.
`.trim();

    try {
      // ... (The rest of the fetch call is unchanged)
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
                  {
                    text: "Respond as Tori in one short, friendly message.",
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.warn("Gemini error:", errorText);
        const msg =
          "I got a little scrambled there—mind asking that one more time?";
        pushToriMessage(msg);
        await speakTori(msg);
        return;
      }

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "I’m here with you—try that once more and I’ll do better.";

      pushToriMessage(reply);
      await speakTori(reply);
    } catch (err) {
      console.warn("Tori error:", err);
      const msg =
        "Something glitched on my side—can you try again in a moment?";
      pushToriMessage(msg);
      await speakTori(msg);
    } finally {
      setLoading(false);
    }
  }

  // ... (pushToriMessage and speakTori are unchanged)
  function pushToriMessage(text: string) {
    setMessages((prev) => [...prev, { from: "tori", text }]);
  }

  async function speakTori(text: string) {
    Speech.stop();
    if (ELEVEN_API_KEY && ELEVEN_VOICE_ID) {
      try {
        const ttsRes = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`,
          {
            method: "POST",
            headers: {
              "xi-api-key": ELEVEN_API_KEY,
              "Content-Type": "application/json",
              Accept: "audio/mpeg",
            },
            body: JSON.stringify({
              text,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.4,
                similarity_boost: 0.85,
                style: 0.4,
                use_speaker_boost: true,
              },
            }),
          }
        );

        if (!ttsRes.ok) {
          console.warn(
            "ElevenLabs TTS failed:",
            await ttsRes.text()
          );
          Speech.speak(text, { rate: 3.0, pitch: 1.02 });
          return;
        }

        const arrayBuf = await ttsRes.arrayBuffer();
        const base64 = arrayBufferToBase64(arrayBuf);
        const uri = `data:audio/mpeg;base64,${base64}`;

        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );
        return;
      } catch (err) {
        console.warn("ElevenLabs error:", err);
      }
    }
    Speech.speak(text, { rate: 1.0, pitch: 1.02 });
  }

  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    // ... (permission container is unchanged)
     return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: "center", color: "white" }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestCameraPermission} style={styles.sendBtn}>
          <Text style={styles.sendLabel}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={StyleSheet.absoluteFillObject} facing="back" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.container}>
          {/* MODIFIED: Header to show location status */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/tori_logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.title}>Tori</Text>
              <Text style={styles.subtitle}>
                {location ? `📍 Near You` : (locationErrorMsg || "Finding location...")}
              </Text>
            </View>
          </View>

          {/* Body and Input are unchanged */}
          <ScrollView
            style={styles.messagesContainer}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {messages.slice(-2).map((m, i) => (
              <View
                key={i}
                style={[
                  styles.bubble,
                  m.from === "user" ? styles.userBubble : styles.toriBubble,
                ]}
              >
                <Text style={styles.bubbleLabel}>
                  {m.from === "user" ? "You" : "Tori"}
                </Text>
                <Text style={styles.bubbleText}>{m.text}</Text>
              </View>
            ))}
            {loading && (
              <View style={[styles.bubble, styles.toriBubble]}>
                <Text style={styles.bubbleLabel}>Tori</Text>
                <Text style={styles.bubbleText}>Thinking with you…</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask Tori something..."
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              editable={!loading}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              onPress={handleSend}
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
      </KeyboardAvoidingView>
    </View>
  );
}

// ... (Styles are unchanged)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#020817",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  logo: { width: 40, height: 40, marginRight: 10 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E5E7EB",
  },
  subtitle: { fontSize: 12, color: "#9CA3AF" },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  bubble: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 6,
    maxWidth: "85%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(37, 99, 235, 0.8)", 
  },
  toriBubble: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(55, 65, 81, 0.8)", 
  },
  bubbleLabel: {
    fontSize: 9,
    color: "#E5E7EB", 
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
    backgroundColor: "rgba(2, 8, 23, 0.8)",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(2, 8, 23, 0.5)",
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