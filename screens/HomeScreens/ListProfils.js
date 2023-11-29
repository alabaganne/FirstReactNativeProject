import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import firebase from "../../config";
const database = firebase.database();

export default function ListProfils() {
  const [profils, setProfils] = useState([]);

  // Get profiles data
  useEffect(() => {
    // code executed when component mounts
    const refProfils = database.ref("profils");
    refProfils.get().then((snapshot) => {
      let data = [];
      Object.values(snapshot.val()).forEach((value) => {
        data.push(value);
      });
      setProfils(data);
    });
    return () => {
      // code executed when component unmounts
    }
  }, [])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>List profiles</Text>
      {profils.map((p) => {
        return (
          <Text key={p.numero}>{p.nom} {p.prenom} - {p.numero}</Text>
        )
      })}
    </View>
  );
}
