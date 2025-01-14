// src/redux/actions/userActions.js
import { SET_BANKROLL, SET_BET_TYPE, SET_SPORTBOOK } from '../types/userTypes';

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
