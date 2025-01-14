import { combineReducers } from 'redux';
import upcomingOddsReducer from './odds/reducers/oddsReducer';
import userReducer from './user/reducers/userReducers';
import teamReducer from './teams/reducers/teamReducers';  // Import teamReducer

const rootReducer = combineReducers({
  games: upcomingOddsReducer,
  user: userReducer,
  teams: teamReducer, 

});

export default rootReducer;