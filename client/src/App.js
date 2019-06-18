import React, { Fragment, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
/* Imports to user REDUX - a biblioteca que junta o react com o redux  */
import { Provider } from 'react-redux'
import store from './store'
/* end of REDUX imports */
import Alert from './components/layout/Alert'
/* para verificar se o usuário está autenticado */
import { loadUser } from  './actions/auth'
import setAuthToken from './utils/setAuthToken'

if (localStorage.token)
{
    setAuthToken(localStorage.token);
}

const App = ()=> {
/* use Effect fica executando o metodo do store.dispatch em loop a não ser que se use um [] como segundo parâmetro */
  useEffect(()=>{
    store.dispatch(loadUser());
  }, []);
  return  (<Provider store={store}>
      <Router>
        <Fragment >
          <Navbar />
          <Route exact path="/"  component={ Landing } />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
      </Provider>)

}

export default App;





// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
//

// Mudamos tudo para arrow functions, que ao trazer somente uma linha de retorno pode omitir a palavra return
// removemos a div, para utilizar um Fragment, que é uma div fantasma -  a tag div não aparece no html renderizado
