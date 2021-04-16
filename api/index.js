import keys from "../keys";

export async function fetchNearbyStores(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&type=convenience_store&key=${keys.googleApiKey}`;

  try {
    const response = await fetch(url);
    const res = await response.json();

    if (res.error_message) {
      throw new Error("Cannot find stores");
    }

    return res;
  } catch (error) {
    console.warn("Error, check API");
  }
}

export async function fetchDistanceData(lat, lng, placeId) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=walking&origins=${lat},${lng}&destinations=place_id:${placeId}&key=${keys.googleApiKey}`;

  try {
    const response = await fetch(url);
    const res = await response.json();

    if (res.error_message) {
      throw new Error("Cannot get distance data");
    }

    return res;
  } catch (error) {
    console.warn("Error, check API");
  }
}
