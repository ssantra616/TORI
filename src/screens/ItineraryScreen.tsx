import { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Nav = NativeStackNavigationProp<RootStackParamList, "Itinerary">;

type Stop = {
  id: string;
  title: string;
  note?: string;
};

const PURPLE = "#7B1EFF";

export default function ItineraryScreen() {
  const navigation = useNavigation<Nav>();
  const [stops, setStops] = useState<Stop[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const canSave = title.trim().length > 0;

  function addStop() {
    if (!canSave) return;
    const s: Stop = {
      id: Math.random().toString(36).slice(2),
      title: title.trim(),
      note: note.trim() || undefined,
    };
    setStops((prev) => [s, ...prev]);
    setTitle("");
    setNote("");
    setModalOpen(false);
  }

  function removeStop(id: string) {
    setStops((prev) => prev.filter((s) => s.id !== id));
  }

  const empty = useMemo(
    () => (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyTitle}>No stops yet</Text>
        <Text style={styles.emptySub}>Add a place you want Tori to guide you to.</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Itinerary</Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: "#000" }]}
            onPress={() => setModalOpen(true)}
          >
            <Text style={[styles.headerBtnText, { color: "#FFF" }]}>Add Stop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: "#FFF", borderColor: "#000", borderWidth: 2 }]}
            onPress={() => navigation.navigate("Actions")}
          >
            <Text style={[styles.headerBtnText, { color: "#000" }]}>Actions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={stops}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={empty}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {!!item.note && <Text style={styles.cardNote}>{item.note}</Text>}
            </View>

            <TouchableOpacity style={styles.deleteBtn} onPress={() => removeStop(item.id)}>
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add stop modal */}
      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.scrim} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Add a stop</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Place name (e.g., Library, Café Moxie)"
            placeholderTextColor="#A3A3A3"
            style={styles.input}
          />
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Optional note (why visit / time)"
            placeholderTextColor="#A3A3A3"
            style={[styles.input, { height: 90, textAlignVertical: "top" }]}
            multiline
          />

          <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => setModalOpen(false)}
              style={[styles.sheetBtn, { backgroundColor: "#FFF", borderWidth: 2, borderColor: "#000" }]}
            >
              <Text style={[styles.sheetBtnText, { color: "#000" }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={addStop}
              disabled={!canSave}
              style={[styles.sheetBtn, { backgroundColor: canSave ? "#000" : "#6B7280" }]}
            >
              <Text style={[styles.sheetBtnText, { color: "#FFF" }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PURPLE },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: "#FFF", fontSize: 24, fontWeight: "900" },
  headerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  headerBtnText: { fontSize: 14, fontWeight: "800" },

  emptyWrap: { paddingTop: 28, alignItems: "center" },
  emptyTitle: { color: "#FFF", fontWeight: "800", fontSize: 18, marginBottom: 4 },
  emptySub: { color: "#EDEDED" },

  card: {
    borderRadius: 16,
    backgroundColor: "#FFF",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  cardNote: { marginTop: 4, color: "#6B7280" },

  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#000",
  },
  deleteText: { color: "#FFF", fontWeight: "800" },

  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: Platform.select({ ios: 28, android: 16 }),
  },
  sheetTitle: { fontSize: 18, fontWeight: "900", marginBottom: 10 },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 10,
  },
  sheetBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  sheetBtnText: { fontWeight: "800", fontSize: 15 },
});
