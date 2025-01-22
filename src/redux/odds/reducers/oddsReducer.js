// upcomingOddsReducer.js
const initialState = {
    games: [],
    pastGames: [],
    isLoading: false,
    error: null,
  };
  
  function upcomingOddsReducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_ODDS':
        return {...state, games: action.payload}
      case 'SET_PAST_ODDS':
        return {...state, pastGames: action.payload}
      default:
        return state;
    }
  }
  
  export default upcomingOddsReducer;