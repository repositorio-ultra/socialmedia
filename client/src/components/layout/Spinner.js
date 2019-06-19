import React, {Fragment} from 'react'
import Spinner from './loading.gif'

export default () => 
(
    <Fragment>
    <img
    src={Spinner}
    style={{'width': 200, 'margin':'auto', 'display':'block'}}  alt="spinner"/>
    </Fragment>
)
