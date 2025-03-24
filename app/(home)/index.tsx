import { useSetAtom } from "jotai";
import { StyleSheet, Text, View } from "react-native";
import { logoutAtom } from "../../entities/auth/model/auth.state";
import { Button } from "../../shared/Button/Button";
import WebView from "react-native-webview";
import MapLibreDOMComponent from "../../entities/maplibre/ui/MapLibre";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
// import * as TaskManager from "expo-task-manager";

export default function MyCourses() {
  const [location, setLocation] = useState(null);

  return (
    <MapLibreDOMComponent
      name="Aleksey"
      dom={{
        scrollEnabled: false,
      }}
    />
  );
}

const styles = StyleSheet.create({
  // text: {
  //   color: "#ff0000",
  // },
  container: {
    flex: 1,
    // marginTop: Constants.statusBarHeight,
  },
});
