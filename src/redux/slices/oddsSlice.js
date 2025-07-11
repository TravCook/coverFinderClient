// slices/gamesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  games: [],
  pastGames: [],
  sports: [],
  teams: [],
  mlModelWeights: []
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setGames: (state, action) => {
      state.games = action.payload; // safe mutation with Immer
    },
    setPastGames: (state, action) => {
      state.pastGames = action.payload;
    },
    setPastGamesEmit: (state, action) => {
      const updates = action.payload;

      // Create a map of updated games by ID
      const updateMap = new Map(updates.map(game => [game.id, game]));

      // Merge: keep updated versions where IDs match
      state.pastGames = state.pastGames.map(game =>
        updateMap.has(game.id) ? updateMap.get(game.id) : game
      );

      // Add any new games from updates that aren't in pastGames yet
      const existingIds = new Set(state.pastGames.map(game => game.id));
      const newGames = updates.filter(game => !existingIds.has(game.id));

      state.pastGames = [...state.pastGames, ...newGames];
    },
    setSports: (state, action) => {
      state.sports = action.payload;
    },
    setTeams: (state, action) => {
      state.teams = action.payload;
    },
    setMLModelWeights: (state, action) => {
      state.mlModelWeights = action.payload;
    }
  }
});

export const {
  setGames,
  setPastGames,
  setPastGamesEmit,
  setSports,
  setTeams,
  setMLModelWeights
} = gamesSlice.actions;

export default gamesSlice.reducer;
