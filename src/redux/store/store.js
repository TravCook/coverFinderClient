// src/redux/store/store.js
import { configureStore } from '@reduxjs/toolkit'; // Correct import
import {thunk} from 'redux-thunk'; // Correct import
import rootReducer from '../rootReducer'; // Adjust if necessary

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false
    }).concat(thunk), // Add thunk middleware
});

export default store;
