import React, { useContext, useState, useEffect } from "react";
import {
  getNearbyStores,
  updateFavorites,
} from "../contexts/globalContext/GlobalMethods";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Pressable,
  View,
  Text,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import GlobalContext from "../contexts/globalContext/GlobalContext";
import * as Location from "expo-location";
import StoreItem from "../components/StoreItem";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ResultsScreen = ({ navigation }) => {
  const store = useContext(GlobalContext);
  const [refreshing, setRefreshing] = useState(false);

  const refreshResultsHandler = async () => {
    setRefreshing(true);
    let { coords } = await Location.getCurrentPositionAsync({});
    await getNearbyStores(
      store.dispatch,
      coords.latitude,
      coords.longitude,
      store
    );
    setRefreshing(false);
  };

  const openDirectionsHandler = (lat, lng, placeId) => {
    var url = `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${lat},${lng}&destination_place_id=${placeId}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const addOrRemoveFavoriteHandler = async (selectedStore) => {
    // await AsyncStorage.clear();
    const existingFavoritedStores = await AsyncStorage.getItem("favorites");

    if (!existingFavoritedStores || existingFavoritedStores.length <= 2) {
      await AsyncStorage.setItem(
        "favorites",
        JSON.stringify([{ ...selectedStore, _favorited: true }])
      );
    } else if (existingFavoritedStores.length > 0) {
      const favorites = JSON.parse(existingFavoritedStores);
      const foundIndex = favorites.findIndex(
        (fav) => fav.place_id === selectedStore.place_id
      );

      if (foundIndex !== -1) {
        let favsCopy = [...favorites];
        favsCopy.splice(foundIndex, 1);
        await AsyncStorage.setItem("favorites", JSON.stringify(favsCopy));
      } else {
        const updatedFavorites = [
          ...favorites,
          { ...selectedStore, _favorited: true },
        ];
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify(updatedFavorites)
        );
      }
    }

    const updatedResult = await AsyncStorage.getItem("favorites");
    updateFavorites(store.dispatch, JSON.parse(updatedResult));
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#00acee", flex: 1 }}>
      <FlatList
        contentContainerStyle={{ backgroundColor: "#00acee" }}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View
            style={{
              backgroundColor: "#00acee",
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 10,
            }}
          >
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Entypo name="chevron-with-circle-left" size={39} color="white" />
            </Pressable>
            <Text style={styles.header}>Nearby Stores</Text>
          </View>
        }
        onRefresh={refreshResultsHandler}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        style={{ width: "100%" }}
        data={store.results}
        renderItem={({ item, index }) => (
          <StoreItem
            item={item}
            index={index}
            openDirectionsHandler={openDirectionsHandler}
            addOrRemoveFavoriteHandler={() => addOrRemoveFavoriteHandler(item)}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    color: "white",
    fontSize: 25,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default ResultsScreen;
