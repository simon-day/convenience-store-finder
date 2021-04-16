import React, { useContext } from "react";
import { updateFavorites } from "../contexts/globalContext/GlobalMethods";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
} from "react-native";
import GlobalContext from "../contexts/globalContext/GlobalContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StoreItem from "../components/StoreItem";
import { Entypo } from "@expo/vector-icons";
import * as Linking from "expo-linking";

const FavoritesScreen = ({ navigation }) => {
  const store = useContext(GlobalContext);

  const openDirectionsHandler = (lat, lng, placeId) => {
    var url = `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${lat},${lng}&destination_place_id=${placeId}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
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
      await AsyncStorage.setItem("favorites", JSON.stringify([selectedStore]));
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
        const updatedFavorites = [...favorites, selectedStore];
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
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={{ marginTop: 10 }}
        ListHeaderComponent={
          <View>
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
                <Entypo
                  name="chevron-with-circle-left"
                  size={39}
                  color="white"
                />
              </Pressable>
              <Text style={styles.favoritesHeader}>Your Favorites</Text>
            </View>
            {store.favorites.length === 0 && (
              <Text
                style={{
                  fontSize: 20,
                  marginHorizontal: 20,
                  color: "white",
                  fontWeight: "600",
                  marginTop: 10,
                  //   textAlign: "center",
                }}
              >
                You have no favorites. When you visit a store you like, be sure
                to add it by swiping and starring!
              </Text>
            )}
          </View>
        }
        stickyHeaderIndices={[0]}
        keyExtractor={(item, index) => item.place_id.toString()}
        data={store?.favorites}
        renderItem={({ item, index }) => (
          <StoreItem
            favorite
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
  container: {
    flex: 1,
    backgroundColor: "#00acee",
  },
  favoritesHeader: {
    color: "white",
    fontSize: 25,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default FavoritesScreen;
