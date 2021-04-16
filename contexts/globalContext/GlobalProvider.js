import React, { useReducer } from "react";
import GLOBAL_STATE from "./GlobalState";
import GlobalReducer from "./GlobalReducer";
import GlobalContext from "./GlobalContext";

const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(GlobalReducer, GLOBAL_STATE);

  return (
    <GlobalContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
