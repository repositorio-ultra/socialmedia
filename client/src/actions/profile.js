/*
Este é o terceiro passo
Este arquvio vai fornecer o parâmetro action, utilizado no reducer reducer/profile.js

Ele precisa importar a lib axios, que é que conecta
traz a função de alertas, da action alerta
traz os tipos de ação definidos na action types

a Primeira coisa e obter o profile do usuário ativo
getCurrentProfile é uma variável, que vai receber uma arrow function, sem parâmetros, que retorna asyn uma outra
funcão arrow que recebe como parâmetro uma funcão dispatch  que é chamada após a arrow function consultar o banco

a função dispatch ( verificar onde é definida ) recebe como parâmetro o tipo do resultado da consulta ao banco
e os dados da consulta - type e payload, que são enviadas ao reducer

Depois de chamar o composer e setar os estados gerados pela consulta ao banco de dados, esta função vai ser chamada no
component - no caso o components/dashboars/Dashboard.js



*/

import axios from 'axios';
import { setAlert } from './alert'
import { GET_PROFILE, PROFILE_ERROR } from './types'

// Get current user profile

export const getCurrentProfile = () => async dispatch =>{

    try {
        const profile = await axios.get('/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: profile.data
        })
        
    } catch (error) {

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
        
    }

}
// Create or update profile
export const createProfile = (
    formData,
    history,
    edit = false
  ) => async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
  
      const res = await axios.post('/api/profile', formData, config);
  
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
  
      dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
  
      if (!edit) {
        history.push('/dashboard');
      }
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }
  
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
