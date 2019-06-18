import React, { Fragment, useState } from 'react';
/*import axios from 'axios'; // Usando axios, funciona bem! */
import {Link, Redirect} from 'react-router-dom'
/* para mandar os alertas, precisamos conectar com os dispatcher de alertas */
import { connect } from 'react-redux'
import { login } from '../../actions/auth'
import PropTypes from 'prop-types'

const Login = ({login, isAuthenticated}) => {
    const [ formData, setFormData] = useState({
        email: '',
        password: ''
    });
    /* Destructure para pegar os campos do objeto */

    const { email, password } = formData;

    const onChange = (e)=> setFormData({...formData,[e.target.name]:e.target.value});
    const onSubmit = async (e)=> {
        e.preventDefault();
        login(email, password);
    }
    if(isAuthenticated)
    {
        return <Redirect to="/dashboard" />
    }

    return (<Fragment>
    <h1 className='large text-primary'>Login</h1>
    <p className='lead'>
        <i className='fas fa-user' /> Log Into your Account
    </p>
    <form className='form' onSubmit={e=>onSubmit(e)}>
        <div className='form-group'>
            <input type='email' placeholder='Email Address' name='email'  value={email} onChange={ e=>onChange(e)} />
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
        <input type='submit' className='btn btn-primary' value='Login' />
    </form>
    <p className='my-1'>
        Don't have an account? <Link to='/register'>Register</Link>
    </p>
    </Fragment>)

}

Login.propTypes= {
    login: PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps,{login})(Login);
