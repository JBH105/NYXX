import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import userSlice from "./user/userSlice";
import documentSlice from "./document/documentSlice";

const reducers = combineReducers({
  user: userSlice,
  document:documentSlice,
})

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "profile"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  // middleware: [thunk],
});

export default store;
