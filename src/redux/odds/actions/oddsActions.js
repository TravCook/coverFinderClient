import {
    FETCH_UPCOMING_ODDS_FAILURE,
    FETCH_UPCOMING_ODDS_REQUEST,
    FETCH_UPCOMING_ODDS_SUCCESS,
    SET_ODDS,
    FETCH_PAST_ODDS_REQUEST,
    FETCH_PAST_ODDS_SUCCESS,
    FETCH_PAST_ODDS_FAILURE,
    SET_PAST_ODDS
} from '../types/oddActionTypes'

export const fetchUpcomingOddsRequest = () => ({
    type: FETCH_UPCOMING_ODDS_REQUEST
})
export const fetchUpcomingOddsSuccess = (games) => ({
    type: FETCH_UPCOMING_ODDS_SUCCESS
})
export const fetchUpcomingOddsFailure = (error) => ({
    type: FETCH_UPCOMING_ODDS_FAILURE
})

export const setPastOdds = (data) => ({
    type: SET_PAST_ODDS,
    payload: data
})

export const setOdds = (data) => ({
    type: SET_ODDS,
    payload: data
})

export const fetchoPastOddsRequest = () => ({
    type: FETCH_PAST_ODDS_REQUEST
})
export const fetchPastOddsSuccess = (pastGames) => ({
    type: FETCH_PAST_ODDS_SUCCESS
})
export const fetchPastOddsFailure = (error) => ({
    type: FETCH_PAST_ODDS_FAILURE
})