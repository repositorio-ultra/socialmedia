import { SET_ALERT, REMOVE_ALERT } from '../actions/types'

const initialState = [/*
    {
        id: 1,
        msg: 'Please log in',
        alertType: 'success'
    }
    */
];

export default function( state = initialState, action){

    /* assim funciona, mas fica melhor da forma abaixo
    switch(action.type)
    {
        case SET_ALERT:
            return [ ...state, action.payload];  retorna um array com cópia dos states mais o novo state vindo no action.payload 
        case REMOVE_ALERT:
            return state.filter(state => state.id !== action.payload);
        default:
            return state;
    }*/

    const { type, payload } = action;

    switch(type)
    {
        case SET_ALERT:
            return [ ...state, payload];
        case REMOVE_ALERT:
            return state.filter(state => state.id !== payload);
        default:
            return state;
    }


}