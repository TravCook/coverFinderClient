// src/redux/actions/teamActions.js
import { SET_TEAMS } from '../types/teamActionTypes';

// Action to set the list of teams
export const setTeams = (teams) => ({
  type: SET_TEAMS,
  payload: teams,  // Teams data passed as payload
});
