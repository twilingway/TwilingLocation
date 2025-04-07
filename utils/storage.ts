import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocationObject } from "expo-location";

export interface TrackSummary {
  date: string;
  points: number;
  startTime: string;
  endTime: string;
  size: number;
}

export async function getTrackSummaries(): Promise<TrackSummary[]> {
  const keys = await AsyncStorage.getAllKeys();
  const trackKeys = keys.filter((k) => k.startsWith("track_"));

  const summaries: TrackSummary[] = [];

  for (const key of trackKeys) {
    const date = key.replace("track_", "");
    const raw = await AsyncStorage.getItem(key);
    if (!raw) continue;

    const size = new Blob([raw]).size;
    const track: LocationObject[] = JSON.parse(raw);

    if (track.length === 0) continue;

    const start = new Date(track[0].timestamp);
    const end = new Date(track[track.length - 1].timestamp);

    summaries.push({
      date,
      points: track.length,
      startTime: start.toLocaleTimeString(),
      endTime: end.toLocaleTimeString(),
      size,
    });
  }

  summaries.sort((a, b) => (a.date < b.date ? 1 : -1));
  return summaries;
}

export async function deleteTrack(date: string): Promise<void> {
  await AsyncStorage.removeItem(`track_${date}`);
}

export async function shareTrackAsGPX(date: string): Promise<void> {
  const raw = await AsyncStorage.getItem(`track_${date}`);
  if (!raw) return;

  const track: LocationObject[] = JSON.parse(raw);

  const gpx = generateGPX(track, date);
  const fileUri = `${FileSystem.cacheDirectory}track_${date}.gpx`;

  await FileSystem.writeAsStringAsync(fileUri, gpx, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  await Sharing.shareAsync(fileUri, {
    mimeType: "application/gpx+xml",
    dialogTitle: `Поделиться GPX треком (${date})`,
  });
}

function generateGPX(track: LocationObject[], date: string): string {
  const points = track
    .map(
      (loc) => `
        <trkpt lat="${loc.coords.latitude}" lon="${loc.coords.longitude}">
          <time>${new Date(loc.timestamp).toISOString()}</time>
        </trkpt>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="GeoTrackerApp" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Track for ${date}</name>
  </metadata>
  <trk>
    <name>Track ${date}</name>
    <trkseg>
      ${points}
    </trkseg>
  </trk>
</gpx>`;
}
