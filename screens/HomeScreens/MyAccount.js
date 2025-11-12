import { View, Text, StyleSheet, TextInput, Button, Image, Pressable, ActivityIndicator, Alert } from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import userPhoto from "../../assets/user.png";
import firebase from "../../config";
import * as ImagePicker from 'expo-image-picker';

const database = firebase.database();
const storage = firebase.storage();
const auth = firebase.auth();

export default function MyAccount({ navigation }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [numero, setNumero] = useState("");
  const [urlImage, setUrlImage] = useState(null);
  const [isDefault, setIsDefault] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState({ nom: "", prenom: "", numero: "" });

  useEffect(() => {
    // Get current user
    const user = auth.currentUser;
    setCurrentUser(user);

    // Load existing profile if available
    if (user) {
      loadUserProfile(user.uid);
    }
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const snapshot = await database.ref(`profiles/${userId}`).once('value');
      const profile = snapshot.val();
      if (profile) {
        setNom(profile.nom || "");
        setPrenom(profile.prenom || "");
        setNumero(profile.numero || "");
        if (profile.profileImage) {
          setUrlImage(profile.profileImage);
          setIsDefault(false);
        }
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  const imageToBlob = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    return blob;
  };

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images!');
      return;
    }

    // Pick image
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setIsDefault(false);
      setUrlImage(result.assets[0].uri);
    }
  };

  const uploadImageToStorage = async (uri) => {
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    setUploading(true);
    try {
      const blob = await imageToBlob(uri);
      const filename = `profile_${Date.now()}.jpg`;
      const storageRef = storage.ref(`profileImages/${currentUser.uid}/${filename}`);

      await storageRef.put(blob);
      const downloadURL = await storageRef.getDownloadURL();

      setUploading(false);
      return downloadURL;
    } catch (err) {
      setUploading(false);
      throw err;
    }
  };

  const validateInputs = () => {
    let valid = true;
    const newErrors = { nom: "", prenom: "", numero: "" };

    if (!nom.trim()) {
      newErrors.nom = "Last name is required";
      valid = false;
    }

    if (!prenom.trim()) {
      newErrors.prenom = "First name is required";
      valid = false;
    }

    if (!numero.trim()) {
      newErrors.numero = "Phone number is required";
      valid = false;
    } else if (!/^\+?[\d\s-]+$/.test(numero)) {
      newErrors.numero = "Invalid phone number format";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const createProfile = async () => {
    if (!currentUser) {
      Alert.alert("Not Authenticated", "Please sign in to create a profile");
      navigation.navigate("auth");
      return;
    }

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;

      // Upload image if user selected one
      if (!isDefault && urlImage) {
        imageUrl = await uploadImageToStorage(urlImage);
      }

      // Save profile to database under user's ID
      const profileData = {
        nom,
        prenom,
        numero,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        profileImage: imageUrl,
        updatedAt: new Date().toISOString(),
      };

      await database.ref(`profiles/${currentUser.uid}`).set(profileData);

      setLoading(false);
      Alert.alert("Success", "Profile saved successfully!");
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Failed to save profile. Please try again.");
      console.error("Error creating profile:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 10 }}>My Profile</Text>

      {currentUser && (
        <Text style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
          {currentUser.email}
        </Text>
      )}

      <Pressable onPress={pickImage} disabled={uploading || loading}>
        <View style={styles.imageContainer}>
          <Image
            source={isDefault ? userPhoto : { uri: urlImage }}
            style={styles.profileImage}
          />
          {uploading && (
            <View style={styles.imageOverlay}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}
          <Text style={styles.changePhotoText}>
            {uploading ? "Uploading..." : "Tap to change photo"}
          </Text>
        </View>
      </Pressable>

      <TextInput
        style={[styles.text_input, errors.nom ? styles.input_error : null]}
        placeholder="Last Name (Nom)"
        placeholderTextColor="grey"
        value={nom}
        onChangeText={(text) => {
          setNom(text);
          setErrors({ ...errors, nom: "" });
        }}
        editable={!loading && !uploading}
      />
      {errors.nom ? <Text style={styles.error_text}>{errors.nom}</Text> : null}

      <TextInput
        style={[styles.text_input, errors.prenom ? styles.input_error : null]}
        placeholder="First Name (Prenom)"
        placeholderTextColor="grey"
        value={prenom}
        onChangeText={(text) => {
          setPrenom(text);
          setErrors({ ...errors, prenom: "" });
        }}
        editable={!loading && !uploading}
      />
      {errors.prenom ? <Text style={styles.error_text}>{errors.prenom}</Text> : null}

      <TextInput
        style={[styles.text_input, errors.numero ? styles.input_error : null]}
        placeholder="Phone Number (Numero)"
        placeholderTextColor="grey"
        value={numero}
        onChangeText={(text) => {
          setNumero(text);
          setErrors({ ...errors, numero: "" });
        }}
        keyboardType="phone-pad"
        editable={!loading && !uploading}
      />
      {errors.numero ? <Text style={styles.error_text}>{errors.numero}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <Button
          title="Save Profile"
          onPress={createProfile}
          disabled={uploading}
        />
      )}

      <Button
        title="Sign Out"
        onPress={() => {
          auth.signOut().then(() => navigation.navigate("auth"));
        }}
        color="#FF3B30"
        disabled={loading || uploading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  changePhotoText: {
    marginTop: 8,
    color: "#007AFF",
    fontSize: 14,
  },
  text_input: {
    backgroundColor: "white",
    borderColor: "grey",
    borderWidth: 1,
    borderStyle: "solid",
    width: "80%",
    borderRadius: 10,
    padding: 12,
    color: "black",
    fontSize: 16,
    marginBottom: 10,
  },
  input_error: {
    borderColor: "red",
    borderWidth: 2,
  },
  error_text: {
    color: "#ff6b6b",
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginTop: -5,
    marginBottom: 5,
  },
});
