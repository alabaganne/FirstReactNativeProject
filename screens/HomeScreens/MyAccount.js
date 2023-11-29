import { View, Text, StyleSheet, TextInput, Button, Image, Pressable } from "react-native";
import { useState } from "react";
import React from "react";
import userPhoto from "../../assets/user.png";
import firebase from "../../config";

const database = firebase.database();


import * as ImagePicker from 'expo-image-picker';


const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  // console.log(result);

  if (!result.canceled) {
    setIsdefault(false);
    seturlImage(result.assets[0].uri);
  }
};
const imageToBlob = async (uri) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob"; //bufferArray
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  return blob;
};

export default function MyAccount() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [numero, setNumero] = useState("");

  const createProfile = async () => {
    const refProfils = database.ref("profils");
    try {
      const key = refProfils.push().key;
      const refProfil = refProfils.child("profil" + key);
      await refProfil.set({
        nom,
        prenom,
        numero,
      });
      alert('Profile created successfully!');
    } catch(err) {
      console.log("error:",err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30 }}>My Account</Text>
      <Pressable onPress={pickImage}>
        <Image
          source={userPhoto}
          style={{ width: 100, height: 100, marginVertical: 20 }}
        />
      </Pressable>
      <TextInput
        style={styles.text_input}
        placeholder="Nom"
        placeholderTextColor="grey"
        onChangeText={(text) => setNom(text)}
      />
      <TextInput
        style={styles.text_input}
        placeholder="Prenom"
        placeholderTextColor="grey"
        onChangeText={(text) => setPrenom(text)}
      />
      <TextInput
        style={styles.text_input}
        placeholder="Numero"
        placeholderTextColor="grey"
        onChangeText={(text) => setNumero(text)}
      />
      <Button title="Create" onPress={createProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text_input: {
    backgroundColor: "white",
    borderColor: "grey",
    borderWidth: 1,
    borderStyle: "solid",
    width: "60%",
    borderRadius: 10,
    padding: 10,
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
});
