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
import {
  setAlert
} from './alert'
import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  GET_PROFILES,
  GET_REPOS
} from './types'

// Get current user profile

export const getCurrentProfile = () => async dispatch => {

  try {
    const profile = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: profile.data
    })

  } catch (error) {

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    })

  }

}

// Get All profiles
export const getProfiles = () => async dispatch =>{
  dispatch({ type: CLEAR_PROFILE }); 
  try {
    const res = await axios.get('/api/profile');

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    })
  } 
  catch (err) {
    //console.log("Response " + err.response.data);
    const errors = err.response.data.errors;

    if (errors)
    {
      errors.forEach( error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    })
  }
}


// Get Profile By User ID
export const getProfileById = (userId) => async dispatch =>{
  dispatch({ type: CLEAR_PROFILE }); 
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);
    
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
      msg: err.response.statusText,
      status: err.response.status
      }
    })

}
}

// Get github repos
export const getGithubRepos = (username) => async dispatch =>{
  dispatch({ type: CLEAR_PROFILE }); 
  try {
    const res = await axios.get(`/api/profile/githb/${username}`);
    
    dispatch({
      type: GET_REPOS,
      payload: res.data
    })
  } catch (err) {
    const errors = err.reponse.data.errors;

    if (errors)
    {
      errors.forEach( error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    })
  }
}

// Create or update profile - o history.push é para fazer o redirect
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

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')); /* success é para ficar verde */

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
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};


// ADD experience

export const addExperience = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put('/api/profile/experience', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience added', 'success')); /* success é para ficar verde */


    history.push('/dashboard');

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }

}

// ADD education

export const addEducation = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put('/api/profile/education', formData, config);

    console.log("resposta do servidor" + res);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education added', 'success')); /* success é para ficar verde */


    history.push('/dashboard');

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }

}

// Delete Experiences

export const deleteExperience = (id) => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })

    dispatch(setAlert('Experience Removed', 'success'));

  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }

}

// Delete Education

export const deleteEducation = (id) => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })

    dispatch(setAlert('Education Removed', 'success'));

  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }

}


// Delete Account and Profile

export const deleteAccount= (id) => async dispatch => {
  if ( window.confirm('Are you sure, this can not be undone!'))
  {

    try {
      await axios.delete('/api/profile');
  
      dispatch({
        type: UPDATE_PROFILE
      })

      dispatch({
        type: ACCOUNT_DELETED
      })
  
      dispatch(setAlert('YOUR ACCOUNT HAS BEEN PERMANENTLY DELETED'));/* sem parâmetro, fica cinza */
  
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status
        }
      });
    }


  }


}