// src/redux/slices/teamSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  teams: []
};

const teamsSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload;
    }
  }
});

export const { setTeams } = teamsSlice.actions;
export default teamsSlice.reducer;
