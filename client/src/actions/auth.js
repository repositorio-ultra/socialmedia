/* para chamar a api */
import axios from 'axios'
import {REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR,LOGIN_SUCCESS,LOGIN_FAIL,LOGOUT}  from './types'
import { setAlert } from './alert'
//import uuid from 'uuid'

import setAuthToken from '../utils/setAuthToken'

const uri_api   = '/api/users';
const uri_login = '/api/auth';


// Carregar o Usuário

export const loadUser = () => async dispatch =>{

    if (localStorage.token)
    {
        setAuthToken(localStorage.token);
    }

    try {

        const res = await axios.get('/api/auth');
        dispatch(
            {
                type: USER_LOADED,
                payload: res.data
            }
        );
        
    } catch (err) {

        dispatch({
            type: AUTH_ERROR
        })
        
    }

};


// Registra o Usuário - tem que usar o asyn no dispatch, porque vai consultar a api
export const register = ({name, email, password}) => async dispatch => {

    const config = {
        headers: {"Content-Type": "application/json"}
    }

    const body = JSON.stringify({name, email, password});

    
    try {
        const res  = await axios.post(uri_api, body, config);

        dispatch ({
            type:REGISTER_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());

    } catch (err) {
        const errors  = err.response.data.errors;

        if (errors)
        {
            errors.forEach((error) =>{
                dispatch(
                    setAlert(
                        error.msg,'danger'
                    )
                )
            })
        }

        dispatch ({
            type:REGISTER_FAIL
        });
    }
}

// Loga o Usuário
export const login = (email, password) => async dispatch => {

    const config = {
        headers: {"Content-Type": "application/json"}
    }

    const body = JSON.stringify({email, password});

    console.log(body);
    try {
        const res  = await axios.post(uri_login, body, config);

        dispatch ({
            type:LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());

    } catch (err) {

        const errors  = err.response.data.errors;

        if (errors)
        {
            errors.forEach((error) =>{
                dispatch(
                    setAlert(
                        error.msg,'danger'
                    )
                )
            })
        }

        dispatch ({
            type:LOGIN_FAIL
        });
    }
}

// LOGOUT

export const logout = () => dispatch =>{

    dispatch({
        type:LOGOUT
    });

}