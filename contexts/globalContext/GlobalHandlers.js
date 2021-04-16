const GlobalHandlers = {
  UPDATE_RESULTS: (state, action) => {
    return { ...state, results: action.payload };
  },
  UPDATE_FAVORITES: (state, action) => {
    return { ...state, favorites: action.payload };
  },
};
export default GlobalHandlers;
