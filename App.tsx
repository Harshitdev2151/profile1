import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ProfileGallery from "./Components/ProfileGallery";

export default function App() {
  return <ProfileGallery />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
