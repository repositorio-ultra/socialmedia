 /*
 A estrutura inicial é criada com o atalho rafp que já importa o PropType
 Precisamos na sequência importar o connect da lib react-redux. Ele faz a conexão entre o componente e o reducer

 Depois, na linha de export, temos que chamar o connect e envolver como parâmeto
 1) os estados ( informações obtidas no banco ) mapeados -  a um objeto geralmente chamado de mapStateToProps
 é atribuida uma arraw function que recebe como parâmetro o state
 e a funcão do action getCurrentProfile ( que retorna um objeto com o profile )
 2) o próprio componente, neste caso o Dashboard

 */
import React, {useEffect,Fragment} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../../actions/profile'
import Spinner from '../layout/Spinner'
import DashboardActions from './DashboardActions'
import Experience from './Experience'
import Education from './Education'

/* no lugar do props, desestruturamos para usar somente o getCurrentProfile, auth e profile */

const Dashboard = ({getCurrentProfile,auth:{ user },profile:{profile,loading}}) => {
    /* o use effect é chamado para executar o current profile assim que o componente carrega,
    e somente uma vez - temos que usar o [], para executar somente uma vez */
     useEffect(()=>{
          getCurrentProfile();
     },[getCurrentProfile]);
    return (
             loading && profile === null ? <Spinner /> : <Fragment>
                 <h1 className="large text-primary">
                     Dashboard
                 </h1>
                 <p className="lead"><i className="fas fa-user"></i>{'  '} Welcome,{ user && user.user.name } </p>
                 {profile !== null ? (
                 <Fragment>
                     <DashboardActions />
                     <Experience experience={profile.experience}/>
                     <Education education={profile.education}/>
                </Fragment>)
                 
                 : 
                 <Fragment>
                     <p>You don't have a profile registered yet</p>
                     <Link to='/create-profile'><div className="btn btn-primary">Add Profile</div></Link>
                     
                 </Fragment>}
             </Fragment>

             
    )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,/*funcão que veio da action*/
    auth:PropTypes.object.isRequired, /*objeto que mostra se o cliente está logado ou não */
    profile:PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, {getCurrentProfile})(Dashboard)

