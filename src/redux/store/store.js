// store.js
import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from '../slices/oddsSlice.js'; // new file we'll create
import userReducer from '../slices/userSlice.js'; // new file we'll create
import teamsReducer from '../slices/teamsSlice.js'; // new file we'll create

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    user: userReducer,
    teams: teamsReducer,
    // add other slices here
  }
});
