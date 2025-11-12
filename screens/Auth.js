// Sign In Page

import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import firebase from "../config";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const auth = firebase.auth();

export default function Auth({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateInputs = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

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
    }

    setErrors(newErrors);
    return valid;
  };

  const signIn = () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        setLoading(false);
        navigation.navigate("home");
      })
      .catch((err) => {
        setLoading(false);
        let errorMessage = "An error occurred during sign in";

        if (err.code === "auth/invalid-email") {
          errorMessage = "Invalid email address";
        } else if (err.code === "auth/user-not-found") {
          errorMessage = "No account found with this email";
        } else if (err.code === "auth/wrong-password") {
          errorMessage = "Incorrect password";
        } else if (err.code === "auth/too-many-requests") {
          errorMessage = "Too many failed attempts. Please try again later";
        }

        Alert.alert("Sign In Failed", errorMessage);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.auth_container}>
        <Text style={{ color: "white", fontSize: 30 }}>Authentication</Text>

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
          autoComplete="password"
        />
        {errors.password ? <Text style={styles.error_text}>{errors.password}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : (
          <View style={{ flex: 0, flexDirection: "row", gap: 10, marginTop: 10 }}>
            <Button title="Sign In" onPress={signIn} disabled={loading} />
            <Button title="Cancel" onPress={() => BackHandler.exitApp()} disabled={loading} />
          </View>
        )}

        <Text
          style={{
            color: "white",
            alignSelf: "flex-end",
            paddingRight: 5,
            marginTop: 20,
            textDecorationLine: "underline",
          }}
          onPress={() => !loading && navigation.navigate("newUser")}
        >
          Create new account
        </Text>
      </View>
      <StatusBar style="auto" />
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
  auth_container: {
    backgroundColor: "#0003",
    width: "90%",
    paddingTop: 50,
    paddingBottom: 30,
    minHeight: 400,
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
  },
});
