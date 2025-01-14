// src/redux/reducers/teamReducer.js
import { SET_TEAMS } from '../types/teamActionTypes';

// Initial state
const initialState = {
  teams: [],  // Start with an empty array of teams
};

// Reducer function
const teamReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEAMS:
      return { ...state, teams: action.payload };  // Update teams with payload
    default:
      return state;  // Return the current state if no action matches
  }
};

export default teamReducer;
