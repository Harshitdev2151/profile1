import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

type User = {
  login: { uuid: string };
  picture: { large: string };
  name: { first: string; last: string };
  email: string;
};

const ProfileGallery = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const colorScheme = useColorScheme();

  const loadUsers = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    setLoading(true);
    setError(false);

    try {
      const response = await fetch("https://randomuser.me/api/?results=10", {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data: { results?: User[] } = await response.json();
      if (!Array.isArray(data.results))
        throw new Error("Invalid profile response");

      setUsers(data.results);
    } catch (err) {
      console.error("Unable to load profiles:", err);
      setError(true);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={"large"} color={"#fff"} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>
          Could not load profiles. Check the simulator's internet connection.
        </Text>
        <Pressable style={styles.retryButton} onPress={() => void loadUsers()}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.darkBg : styles.lightBg,
      ]}
    >
      <FlatList
        data={users}
        keyExtractor={(item) => item.login.uuid}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.picture.large }} style={styles.avatar} />
            <Text style={styles.name}>
              {item.name.first} {item.name.last}
            </Text>
            <Text style={styles.email}>{item.email + " (harshit)"}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No profiles found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default ProfileGallery;

const styles = StyleSheet.create({
  container: { flex: 1 },
  darkBg: { backgroundColor: "#121212" },
  lightBg: { backgroundColor: "#fff" },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },

  card: {
    backgroundColor: "#1e1e1e",
    margin: 10,
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },

  email: {
    fontSize: 14,
    color: "#bbb",
  },

  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 24,
    marginBottom: 16,
  },

  retryButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },

  retryText: {
    color: "#121212",
    fontSize: 15,
    fontWeight: "600",
  },

  emptyText: {
    color: "#888",
    textAlign: "center",
    marginTop: 32,
  },
});
