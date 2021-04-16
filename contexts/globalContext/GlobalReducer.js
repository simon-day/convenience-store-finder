import GlobalHandlers from "./GlobalHandlers";

const GlobalReducer = (state, action) => {
  if (GlobalHandlers.hasOwnProperty(action.type)) {
    return GlobalHandlers[action.type](state, action);
  } else {
    return state;
  }
};

export default GlobalReducer;
