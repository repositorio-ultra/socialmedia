/* vamos setar o header x-auth-token com o valor do token */

import axios from 'axios'


const setAuthToken = (token)=>{

    if (token)
    {
        axios.defaults.headers.common['x-auth-token'] = token;
    }
    else
    {
        delete axios.defaults.headers.common['x-auth-token'];
    }

}

export default setAuthToken;