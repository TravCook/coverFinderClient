import {
    SET_ODDS,
    SET_PAST_ODDS,
    SET_VALUE_ODDS,
    SET_SPORTS
} from '../types/oddActionTypes'


export const setPastOdds = (data) => ({
    type: SET_PAST_ODDS,
    payload: data
})

export const setPastOddsEmit = (data) => {
    return (dispatch, getState) => {
        const { pastGames } = getState().games;
        let updatePastGames = [...pastGames];
    
        data.map((game) => {
            let objectFound = updatePastGames.find(obj => obj.id === game.id);
            
            if (!objectFound) {
                updatePastGames.push(game);
            }
        });
        // Sort without mutating the original array
        let sortedUpdateArr = [...updatePastGames].sort((a, b) => new Date(b.commence_time) - new Date(a.commence_time));
        
        dispatch(setPastOdds(sortedUpdateArr));
    }
    
}

export const setValueOdds = (data) => ({
    type: SET_VALUE_ODDS,
    payload: data
})

export const setOdds = (data) => ({
    type: SET_ODDS,
    payload: data
})

export const setSports =(data) => ({
    type: SET_SPORTS,
    payload: data
})