// upcomingOddsReducer.js
const initialState = {
    games: [],
    pastGames: [],
    valueGames: [],
    sports: [],
    isLoading: false,
    error: null,
  };
  
  function upcomingOddsReducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_ODDS':
        return {...state, games: action.payload}
      case 'SET_PAST_ODDS':
        return {...state, pastGames: action.payload}
      case 'SET_VALUE_ODDS':
        return {...state, valueGames: action.payload}
      case 'SET_SPORTS':
        return {...state, sports: action.payload}
      default:
        return state;
    }
  }
  
  export default upcomingOddsReducer;