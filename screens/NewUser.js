import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";

import { StatusBar } from "expo-status-bar";
import firebase, { db } from "../config";
import React from "react";

const auth = firebase.auth();

export default function NewUser({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const createrNewUser = () => {
    console.log('createNewUser');
    auth.createUserWithEmailAndPassword(email, password).then(function (res) {
      console.log(res);
      alert("User created successfully!");
    })
  };
  return (
    <View style={styles.container}>
      <View style={styles.auth_container}>
        <Text style={{ color: "#111111", fontSize: 30 }}>Create new user</Text>
        <TextInput
          style={styles.text_input}
          placeholder="Email"
          placeholderTextColor="#111"
          
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.text_input}
          placeholder="Password"
          placeholderTextColor="#111"
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.text_input}
          placeholder="Confirm password"
          placeholderTextColor="#111"
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <View style={{ flex: 0, flexDirection: "row", gap: 10 }}>
          <Button title="Create" onPress={createrNewUser} />
          <Button title="Cancel" onPress={() => navigation.navigate("auth")} />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  auth_container: {
    backgroundColor: "#0003",
    width: "90%",
    paddingTop: 50,
    height: 350,
    flex: 0,
    gap: 10,
    alignItems: "center",
    justifyContent: "start",
    borderRadius: 10,
  },
  text_input: {
    backgroundColor: "black",
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
    width: "60%",
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
  },
});
