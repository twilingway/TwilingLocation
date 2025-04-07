import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const TRACK_INDEX_PREFIX = "track_index_";
const ACTIVE_TRACK_KEY = "active_track";

export async function getActiveTrackName(): Promise<string | null> {
  return await AsyncStorage.getItem(ACTIVE_TRACK_KEY);
}

export async function setActiveTrackName(name: string): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_TRACK_KEY, name);
}

export async function clearActiveTrack(): Promise<void> {
  await AsyncStorage.removeItem(ACTIVE_TRACK_KEY);
}

export async function generateNextTrackName(): Promise<string> {
  const date = new Date().toISOString().slice(0, 10);
  const counterKey = `${TRACK_INDEX_PREFIX}${date}`;
  const current = await AsyncStorage.getItem(counterKey);
  const nextIndex = current ? parseInt(current, 10) + 1 : 1;
  await AsyncStorage.setItem(counterKey, nextIndex.toString());
  return `track_${date}_${nextIndex}`;
}

export async function exportTrackAsGPX(trackName: string): Promise<void> {
  const raw = await AsyncStorage.getItem(trackName);
  if (!raw) return;
  const track = JSON.parse(raw);
  const points = track
    .map(
      (loc: any) =>
        `<trkpt lat="${loc.coords.latitude}" lon="${loc.coords.longitude}">
<time>${new Date(loc.timestamp).toISOString()}</time>
</trkpt>`
    )
    .join("\n");

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Tracker">
<trk><name>${trackName}</name><trkseg>${points}</trkseg></trk>
</gpx>`;

  const fileUri = FileSystem.cacheDirectory + `${trackName}.gpx`;
  await FileSystem.writeAsStringAsync(fileUri, gpx);
  await Sharing.shareAsync(fileUri, { mimeType: "application/gpx+xml" });
}

export async function deleteEmptyTracks(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const trackKeys = keys.filter((k) => k.startsWith("track_"));
  for (const key of trackKeys) {
    const raw = await AsyncStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        await AsyncStorage.removeItem(key);
      }
    }
  }
}
