import { createSlice } from '@reduxjs/toolkit';
import { splitGamesByDay } from '../../utils/helpers/timeHelpers/gameDateHelpers';

const initialState = {
  games: [],
  gamesByDay: {},
  sports: [],
  teams: [],
  mlModelWeights: [],
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setGames: (state, action) => {
      state.games = action.payload;
      state.gamesByDay = splitGamesByDay(action.payload);
    },
    setGamesEmit: (state, action) => {
      // Merge existing games with new/emitted games
      const updatedGamesMap = new Map(state.games.map(g => [g.id, g]));
      for (const g of action.payload) {
        updatedGamesMap.set(g.id, g); // overwrite if exists, add if new
      }
      const updatedGames = Array.from(updatedGamesMap.values());

      state.games = updatedGames;
      state.gamesByDay = splitGamesByDay(updatedGames); // re-split by day
    },
    setSports: (state, action) => { state.sports = action.payload; },
    setTeams: (state, action) => { state.teams = action.payload; },
    setMLModelWeights: (state, action) => { state.mlModelWeights = action.payload; },
  },
});

export const { setGames, setGamesEmit, setSports, setTeams, setMLModelWeights } = gamesSlice.actions;
export default gamesSlice.reducer;
