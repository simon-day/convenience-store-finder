import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Rating } from "react-native-elements";
import Swipeable from "react-native-swipeable";

const StoreItem = ({
  item,
  index,
  favorite,
  openDirectionsHandler,
  addOrRemoveFavoriteHandler,
}) => {
  const [starred, setStarred] = useState(item._favorited);

  const rightButtons = [
    <Pressable
      onPress={() => {
        addOrRemoveFavoriteHandler();
        setStarred(!starred);
      }}
      style={{ backgroundColor: "#00acee", flex: 1, justifyContent: "center" }}
    >
      <MaterialIcons
        name={favorite ? "delete" : starred ? "star" : "star-border"}
        size={40}
        color="white"
      />
    </Pressable>,
  ];

  return (
    <Swipeable rightButtons={rightButtons}>
      <View style={styles.itemContainer}>
        <View style={styles.itemPositionContainer}>
          <Text style={styles.positionText}>{index + 1}</Text>
        </View>

        <View style={styles.logoContainer}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={item.store_info.logo}
          />
        </View>

        <View style={styles.middleContainer}>
          <Text style={styles.distanceText}>{item.distance}</Text>
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            {item.rating && (
              <Text style={{ color: "grey", fontSize: 12 }}>
                {Number(item.rating).toFixed(1)}{" "}
              </Text>
            )}
            {item.rating && (
              <Rating
                startingValue={item.rating}
                style={{}}
                reviews={[]}
                imageSize={12}
                readonly
              />
            )}
            {item.rating ? (
              <Text style={{ color: "grey", fontSize: 12 }}>
                {" "}
                ({item.number_of_ratings})
              </Text>
            ) : (
              <Text style={{ color: "grey", fontSize: 12 }}>
                No reviews yet
              </Text>
            )}
          </View>
        </View>

        <Pressable
          onPress={() =>
            openDirectionsHandler(item.latitude, item.longitude, item.place_id)
          }
          style={{ alignItems: "center" }}
        >
          <MaterialIcons name="directions-walk" size={30} color="#00acee" />
          <Text style={{ color: "#00acee", fontSize: 20, fontWeight: "800" }}>
            {item.duration}
          </Text>
        </Pressable>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    padding: 25,
    marginHorizontal: 15,
    marginVertical: 7,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  itemPositionContainer: {
    backgroundColor: "#00acee",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  positionText: {
    color: "white",
    fontWeight: "800",
    fontSize: 20,
  },
  logoContainer: {
    height: 45,
    width: 45,
  },
  logo: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  middleContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
  },
  distanceText: {
    color: "#00acee",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
  },
});

export default StoreItem;
