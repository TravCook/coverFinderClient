// upcomingOddsReducer.js
const initialState = {
    games: [],
    pastGames: [],
    isLoading: false,
    error: null,
  };
  
  function upcomingOddsReducer(state = initialState, action) {
    switch (action.type) {
      case 'FETCH_UPCOMING_ODDS_REQUEST':
        return { ...state, isLoading: true, error: null };
      case 'FETCH_UPCOMING_ODDS_SUCCESS':
        return { ...state, isLoading: false, games: action.payload };
      case 'FETCH_UPCOMING_ODDS_FAILURE':
        return { ...state, isLoading: false, error: action.payload };
      case 'SET_ODDS':
        return {...state, games: action.payload}
      case 'SET_PAST_ODDS':
        return {...state, pastGames: action.payload}
      default:
        return state;
    }
  }
  
  export default upcomingOddsReducer;