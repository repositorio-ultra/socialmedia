import React, { Fragment, useState } from 'react';
/* para mandar os alertas, precisamos conectar com os dispatcher de alertas */
import { connect } from 'react-redux'
import { setAlert } from '../../actions/alert'

/*import axios from 'axios'; // Usando axios, funciona bem! */
import {Link} from 'react-router-dom'

import PropTypes from 'prop-types'


/* desestruturei  o props.setAlert, para usar só alert */

const Register = ({setAlert}) => {
    const [ formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });
    /* Destructure para pegar os campos do objeto */

    const { name, email, password, password2 } = formData;

    /* Depois atribuo as variáveis acima ao value dos campos do formulário */ 

    /* Depois crio a função que vai controlar os estados dos campos ao serem modificados - onChange  */
    
    /* Para mudar somente o estado do campo nome, copio os campos do formDate e atribuo o novo valor do name */
    // const onChange = (e)=> setFormData ( { ...formData, name: e.target.value} )
    /* Para tornar a função reutilizável eu pego o nome do target do evento entre colchete e atribuo o valor novo: */
    const onChange = (e)=> setFormData({...formData,[e.target.name]:e.target.value});
    const onSubmit = async (e)=> {
        e.preventDefault();
        if (password !== password2)
        {
            setAlert('Passwords do not match', 'danger', 5000);
        }
        else
        {
            /*
            * Funciona perfeitamente!
            
            try {
                const newUser = {
                    
                    name,
                    email,
                    password
                  
                }

                const config = {
                    /* Cuidado!!! o nome tem que ser headers - com s no final */
                   /*  headers : {"Content-Type": "application/json"} 
                }

                const body = JSON.stringify(newUser);
                console.log(body);

                const res = await axios.post('/api/users', body, config);

                console.log(res.data);

                

                
            } catch (error) {
                console.log(error);
            } */

            console.log("SUCCESS");
        }
    }

    return (<Fragment>
    <h1 className='large text-primary'>Sign Up</h1>
    <p className='lead'>
        <i className='fas fa-user' /> Create Your Account
    </p>
    <form className='form' onSubmit={e=>onSubmit(e)}>
        <div className='form-group'>
            <input type='text' placeholder='Name' name='name' value={name} onChange={ e=>onChange(e)} required />
        </div>
        <div className='form-group'>
            <input type='email' placeholder='Email Address' name='email'  value={email} onChange={ e=>onChange(e)} />
            <small className='form-text'>
                This site uses Gravatar so if you want a profile image, use
                a Gravatar email
            </small>
        </div>
        <div className='form-group'>
            <input
                type='password'
                placeholder='Password'
                name='password'
                value={password}
                onChange={ e=>onChange(e)}
                minLength='6'
            />
        </div>
        <div className='form-group'>
            <input
                type='password'
                placeholder='Confirm Password'
                name='password2'
                value={password2}
                onChange={ e=>onChange(e)}
                minLength='6'
            />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
    </form>
    <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
    </p>
    </Fragment>)

}

Register.propTypes= {
    setAlert: PropTypes.func.isRequired
}
/*export default Register; antes de disparar os alertas */
export default connect(null,{ setAlert })(Register);
