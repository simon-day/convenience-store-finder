import { fetchNearbyStores, fetchDistanceData } from "../../api";
import { formatStoreInfo, removeDuplicates } from "../../helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getNearbyStores = async (dispatch, lat, lng, { favorites }) => {
  const response = await fetchNearbyStores(lat, lng);

  if (!response.err) {
    const formattedResults = response.results.map((store) => {
      const isFavorite = favorites?.find(
        (fav) => fav.place_id === store.place_id
      );

      return {
        _favorited: !!isFavorite,
        address: store.vicinity,
        latitude: store.geometry.location.lat,
        longitude: store.geometry.location.lng,
        place_id: store.place_id,
        store_name: store.name,
        rating: store.rating,
        number_of_ratings: store.user_ratings_total,
        store_info: formatStoreInfo(store.name) || null,
      };
    });

    const onlyChains = formattedResults.filter(
      (store) => store.store_info !== null
    );

    const data = await Promise.all(
      onlyChains.map(async (store) => {
        const distanceRes = await fetchDistanceData(lat, lng, store.place_id);
        const obj = {
          ...store,
          distance: distanceRes.rows[0].elements[0].distance.text,
          duration: distanceRes.rows[0].elements[0].duration.text,
          duration_value: distanceRes.rows[0].elements[0].duration.value,
        };

        return obj;
      })
    );
    const sorted = data.sort((a, b) => a.duration_value > b.duration_value);

    const removedDupes = removeDuplicates(sorted);

    dispatch({ type: "UPDATE_RESULTS", payload: removedDupes });
  } else {
    Alert.alert("Error", "Unable to fetch nearby stores", [{ text: "OK" }]);
  }
  return response;
};

export const updateFavorites = (dispatch, update) => {
  const sortedUpdates = update.sort(
    (a, b) => a.duration_value > b.duration_value
  );

  dispatch({ type: "UPDATE_FAVORITES", payload: sortedUpdates });
};
