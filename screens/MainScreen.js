import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  getNearbyStores,
  updateFavorites,
} from "../contexts/globalContext/GlobalMethods";
import {
  Image,
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import GlobalContext from "../contexts/globalContext/GlobalContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as IntentLauncher from "expo-intent-launcher";
import * as Linking from "expo-linking";

const pkg = Constants.manifest.releaseChannel
  ? Constants.manifest.android.package
  : "host.exp.exponent";

const MainScreen = () => {
  const store = useContext(GlobalContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [currentLocation, setCurrentLocation] = useState();

  const setFavorites = async () => {
    const favorites = await AsyncStorage.getItem("favorites");
    if (favorites) {
      updateFavorites(store.dispatch, JSON.parse(favorites));
    }
  };

  useEffect(() => {
    setFavorites();
    checkForPermissions();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      getResultsHandler();
    }
  }, [currentLocation]);

  const getResultsHandler = async () => {
    await getNearbyStores(
      store.dispatch,
      currentLocation.latitude,
      currentLocation.longitude,
      store
    );

    setLoading(false);
    navigation.navigate("ResultsScreen");
  };

  const checkForPermissions = async () => {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status === "granted") {
      setErrorMsg(null);
      setHasPermissions(true);
    } else {
      setHasPermissions(false);
    }
  };

  const askForPermissions = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg(
        "We need access to your current location to find the closest convenience store, please go to your app settings to enable this"
      );
      return;
    } else {
      setHasPermissions(true);
      setErrorMsg(null);
      return true;
    }
  };

  const onPress = async () => {
    if (!hasPermissions) {
      const permissionGranted = await askForPermissions();

      if (permissionGranted) {
        setLoading(true);
        let { coords } = await Location.getCurrentPositionAsync({});

        setCurrentLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      } else {
        openAppSettings();
      }
    } else {
      setLoading(true);
      let { coords } = await Location.getCurrentPositionAsync({});

      setCurrentLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    }
  };

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      IntentLauncher.startActivityAsync(
        IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
        { data: "package:" + pkg }
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => {
          navigation.navigate("FavoritesScreen");
        }}
        style={{
          alignSelf: "flex-end",
          flexDirection: "row",
          marginRight: 20,
          marginTop: 10,
          zIndex: 1,
        }}
      >
        <MaterialIcons name="star" size={38} color="white" />
      </Pressable>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          marginTop: -100,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            alignItems: "center",
            fontSize: 40,
            color: "white",
            fontWeight: "900",
          }}
        >
          🇹🇼TAIWAN
        </Text>
        <View style={{ height: "40%", width: "60%" }}>
          <Text
            style={{
              fontSize: 25,
              color: "white",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Convenience Store Finder
          </Text>
          <Image
            style={{ flex: 1, height: undefined, width: undefined }}
            resizeMode="contain"
            source={require("../assets/images/store.png")}
          />
        </View>
        <Text
          style={{
            fontWeight: "500",
            color: "white",
            textAlign: "center",
            maxWidth: "85%",
            // marginHorizontal: 12,
            fontSize: 18,
            marginBottom: 40,
          }}
        >
          Looking for the closest convenience stores to pay your bills, use the
          bathroom or grab a quick bite to eat? Find them all with a single tap!
        </Text>
        <Pressable
          onPress={onPress}
          style={{
            backgroundColor: "white",
            width: "75%",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            padding: 12,
            flexDirection: "row",
            opacity: !hasPermissions ? 0.5 : 1,
          }}
        >
          <Text style={{ fontSize: 20, color: "#00acee", fontWeight: "600" }}>
            {!hasPermissions ? "Grant Permission" : !loading ? "GO" : "FINDING"}
          </Text>
          {loading && (
            <View style={{ marginLeft: 5 }}>
              <ActivityIndicator color="#00acee" size="small" />
            </View>
          )}
        </Pressable>
        <Text
          style={{
            maxWidth: "85%",
            fontSize: 18,
            color: "white",
            fontWeight: "500",
            textAlign: "center",
            marginTop: 35,
          }}
        >
          {errorMsg}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00acee",
  },
});

export default MainScreen;
