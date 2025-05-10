// src/redux/actions/userActions.js
import { SET_BANKROLL, SET_BET_TYPE, SET_SPORTBOOK, SET_STARRED_GAMES } from '../types/userTypes';

// Action to set bankroll
export const setBankroll = (amount) => ({
  type: SET_BANKROLL,
  payload: amount,  // Amount to update bankroll
});

// Action to set bet type
export const setBetType = (betType) => ({
  type: SET_BET_TYPE,
  payload: betType,  // Bet type (e.g., 'spread', 'moneyline')
});

// Action to set sportsbook
export const setSportsbook = (sportsbook) => ({
  type: SET_SPORTBOOK,
  payload: sportsbook,  // Sportsbook name (e.g., 'DraftKings', 'FanDuel')
});

export const setStarredGames = (games) => ({
  type: SET_STARRED_GAMES,
  payload: games
})

export const updateStarredGames = (newGames) => {
  return (dispatch, getState) => {
    const { starredGames } = getState().user;  // Get current state of starredGames

    // Clone the existing starredGames array to avoid mutating the state directly
    let updatedStarredGames = [...starredGames];

    // Iterate through the newGames and update only existing ones in the starredGames list
    newGames.forEach(newGame => {
      // Check if the game already exists in the starredGames list
      const index = updatedStarredGames.findIndex(starredGame => starredGame.id === newGame.id);

      if (index !== -1) {
        // If the game already exists, update the existing game (replace it)
        updatedStarredGames[index] = newGame;
      }
      // If the game doesn't exist, do nothing (we ignore it)
    });


    // Dispatch the action to update starredGames in Redux store
    dispatch(setStarredGames(updatedStarredGames));
    // Optionally, update localStorage with the new starredGames list
    localStorage.setItem('starredGames', JSON.stringify(updatedStarredGames));
  };
};

export const removeStarredGames = (pastGames) => {
  return (dispatch, getState) => {
    const { starredGames } = getState().user;  // Get current state of starredGames

    // Clone the existing starredGames array to avoid mutating the state directly
    let updatedStarredGames = [...starredGames];

    // Iterate through the pastGames and remove matching games from the starredGames list
    pastGames.forEach(pastGame => {
      // Find the index of the game in starredGames by matching the id
      const index = updatedStarredGames.findIndex(starredGame => starredGame.id === pastGame.id);

      if (index !== -1) {
        // If the game exists, remove it from the array
        updatedStarredGames.splice(index, 1);  // Remove the game from the array
      }
    });


    // Dispatch the action to update starredGames in Redux store
    dispatch(setStarredGames(updatedStarredGames));
    // Optionally, update localStorage with the new starredGames list
    localStorage.setItem('starredGames', JSON.stringify(updatedStarredGames));
  };
};

export const loadStarredGamesFromLocalStorage = () => {
  return (dispatch) => {
    const starredGames = JSON.parse(localStorage.getItem('starredGames')) || [];
    dispatch(setStarredGames(starredGames));
  };
};