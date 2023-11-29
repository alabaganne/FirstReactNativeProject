import { View, Text } from "react-native";
import React from "react";
import MyAccount from "./HomeScreens/MyAccount";
import ListProfils from "./HomeScreens/ListProfils";
import Groupe from "./HomeScreens/Groupe";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
const Tab = createMaterialBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Liste Profiles" component={ListProfils} />
      <Tab.Screen name="Groupe" component={Groupe} />
      <Tab.Screen name="My Account" component={MyAccount} />
    </Tab.Navigator>
  );
}
