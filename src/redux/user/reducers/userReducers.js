// src/redux/reducers/userReducer.js
import { SET_BANKROLL, SET_BET_TYPE, SET_SPORTBOOK } from '../types/userTypes';

// Initial state
const initialState = {
  bankroll: 0,        // Initial bankroll amount
  betType: 'Proportional',        // Initial bet type
  sportsbook: 'fanduel',     // Initial sportsbook
};

// Reducer function to handle user-related actions
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BANKROLL:
      return { ...state, bankroll: action.payload };  // Update bankroll
    case SET_BET_TYPE:
      return { ...state, betType: action.payload };   // Update betType
    case SET_SPORTBOOK:
      return { ...state, sportsbook: action.payload }; // Update sportsbook
    default:
      return state;  // Return current state if no action matches
  }
};

export default userReducer;
