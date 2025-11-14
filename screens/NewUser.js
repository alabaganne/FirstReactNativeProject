import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import firebase from "../config";
import React from "react";

const auth = firebase.auth();

export default function NewUser({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "" });

  const validateInputs = () => {
    let valid = true;
    const newErrors = { email: "", password: "", confirmPassword: "" };

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    } else if (!/(?=.*[0-9])/.test(password)) {
      newErrors.password = "Password must contain at least one number";
      valid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const createNewUser = () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(function (res) {
        setLoading(false);
        Alert.alert(
          "Success",
          "Account created successfully! You can now sign in.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("auth"),
            },
          ]
        );
      })
      .catch(function (err) {
        setLoading(false);
        let errorMessage = "An error occurred during registration";

        if (err.code === "auth/email-already-in-use") {
          errorMessage = "This email is already registered";
        } else if (err.code === "auth/invalid-email") {
          errorMessage = "Invalid email address";
        } else if (err.code === "auth/weak-password") {
          errorMessage = "Password is too weak";
        }

        Alert.alert("Registration Failed", errorMessage);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.auth_container}>
        <Text style={{ color: "white", fontSize: 30, marginBottom: 10 }}>Create Account</Text>
        <Text style={{ color: "#CCC", fontSize: 14, marginBottom: 15, textAlign: "center", paddingHorizontal: 20 }}>
          Password must be at least 6 characters and contain a number
        </Text>

        <TextInput
          style={[styles.text_input, errors.email ? styles.input_error : null]}
          placeholder="Email"
          placeholderTextColor="#AAA"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors({ ...errors, email: "" });
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        {errors.email ? <Text style={styles.error_text}>{errors.email}</Text> : null}

        <TextInput
          style={[styles.text_input, errors.password ? styles.input_error : null]}
          placeholder="Password"
          placeholderTextColor="#AAA"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors({ ...errors, password: "" });
          }}
          secureTextEntry={true}
          autoCapitalize="none"
          autoComplete="password-new"
        />
        {errors.password ? <Text style={styles.error_text}>{errors.password}</Text> : null}

        <TextInput
          style={[styles.text_input, errors.confirmPassword ? styles.input_error : null]}
          placeholder="Confirm Password"
          placeholderTextColor="#AAA"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrors({ ...errors, confirmPassword: "" });
          }}
          secureTextEntry={true}
          autoCapitalize="none"
        />
        {errors.confirmPassword ? <Text style={styles.error_text}>{errors.confirmPassword}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : (
          <View style={{ flex: 0, flexDirection: "row", gap: 10, marginTop: 10 }}>
            <Button title="Create Account" onPress={createNewUser} disabled={loading} />
            <Button title="Cancel" onPress={() => navigation.navigate("auth")} disabled={loading} />
          </View>
        )}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
  },
  auth_container: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: "90%",
    paddingTop: 40,
    paddingBottom: 30,
    minHeight: 480,
    flex: 0,
    gap: 10,
    alignItems: "center",
    justifyContent: "start",
    borderRadius: 10,
  },
  text_input: {
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    borderStyle: "solid",
    width: "80%",
    borderRadius: 10,
    padding: 12,
    color: "#333",
    fontSize: 16,
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
});
