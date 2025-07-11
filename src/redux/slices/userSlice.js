// src/redux/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bankroll: 0,
  betType: 'Proportional',
  sportsbook: 'fanduel',
  starredGames: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setBankroll: (state, action) => {
      state.bankroll = action.payload;
    },
    setBetType: (state, action) => {
      state.betType = action.payload;
    },
    setSportsbook: (state, action) => {
      state.sportsbook = action.payload;
    },
    setStarredGames: (state, action) => {
      state.starredGames = action.payload;
    }
  }
});

// Export actions
export const {
  setBankroll,
  setBetType,
  setSportsbook,
  setStarredGames
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
