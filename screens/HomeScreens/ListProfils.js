import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import firebase from "../../config";
import userPhoto from "../../assets/user.png";

const database = firebase.database();

export default function ListProfils() {
  const [profils, setProfils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfiles = async () => {
    try {
      const snapshot = await database.ref("profiles").once('value');
      const data = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const profile = childSnapshot.val();
          data.push({
            id: childSnapshot.key,
            ...profile,
          });
        });
      }

      setProfils(data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error loading profiles:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfiles();

    // Set up real-time listener
    const profilesRef = database.ref("profiles");
    profilesRef.on('value', (snapshot) => {
      const data = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const profile = childSnapshot.val();
          data.push({
            id: childSnapshot.key,
            ...profile,
          });
        });
      }
      setProfils(data);
    });

    return () => {
      // Clean up listener on unmount
      profilesRef.off();
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadProfiles();
  };

  const renderProfileItem = ({ item }) => (
    <View style={styles.profileCard}>
      <Image
        source={item.profileImage ? { uri: item.profileImage } : userPhoto}
        style={styles.profileImage}
      />
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>
          {item.prenom} {item.nom}
        </Text>
        <Text style={styles.profilePhone}>{item.numero}</Text>
        {item.userEmail && (
          <Text style={styles.profileEmail}>{item.userEmail}</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading profiles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profiles</Text>
      {profils.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No profiles yet</Text>
          <Text style={styles.emptySubtext}>Create your profile in the My Account tab</Text>
        </View>
      ) : (
        <FlatList
          data={profils}
          renderItem={renderProfileItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  listContainer: {
    padding: 10,
  },
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: "#999",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
});
