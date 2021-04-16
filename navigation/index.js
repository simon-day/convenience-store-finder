import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import MainScreen from "../screens/MainScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ResultsScreen from "../screens/ResultsScreen";
import MapScreen from "../screens/MapScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="MainScreen"
        component={MainScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ResultsScreen"
        component={ResultsScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="FavoritesScreen"
        component={FavoritesScreen}
      />
      <Stack.Screen
        options={{ title: "Settings" }}
        name="SettingsScreen"
        component={SettingsScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="MapScreen"
        component={MapScreen}
      />
    </Stack.Navigator>
  );
}
