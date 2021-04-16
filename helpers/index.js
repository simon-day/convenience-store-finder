import { STORES } from "../consts";

export const removeDuplicates = (arr) => {
  let result = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (result[result.length - 1].duration_value !== arr[i].duration_value) {
      result.push(arr[i]);
    }
  }
  return result;
};

export const formatStoreInfo = (storeName) => {
  let res = "";
  STORES.forEach((store) => {
    if (
      storeName.toLowerCase().includes(store.englishName.toLowerCase()) ||
      storeName.includes(store.chineseName) ||
      store.altNames.find((altName) =>
        storeName.toLowerCase().includes(altName.toLowerCase())
      )
    ) {
      res = store;
    }

    return res;
  });

  return res;
};
