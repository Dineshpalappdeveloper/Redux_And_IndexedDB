// store.js
import { configureStore } from "@reduxjs/toolkit";
import studentSlice from "./slice/studentSlice";

const store = configureStore({
  reducer: {
    student: studentSlice,
  },
});

export default store;
