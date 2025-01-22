import {
    SET_ODDS,
    SET_PAST_ODDS
} from '../types/oddActionTypes'


export const setPastOdds = (data) => ({
    type: SET_PAST_ODDS,
    payload: data
})

export const setOdds = (data) => ({
    type: SET_ODDS,
    payload: data
})