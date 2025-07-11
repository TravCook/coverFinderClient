import {io} from 'socket.io-client'

export const socket = io(`http://${import.meta.env.VITE_REACT_APP_API_URL}`)
