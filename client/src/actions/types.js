export const SET_ALERT         = 'SET_ALERT';
export const REMOVE_ALERT      = 'REMOVE_ALERT';
export const REGISTER_SUCCESS  = 'REGISTER_SUCCESS';
export const REGISTER_FAIL     = 'REGISTER_FAIL';
export const USER_LOADED       = 'USER_LOADED';
export const AUTH_ERROR        = 'AUTH_ERROR';
export const LOGIN_SUCCESS     = 'LOGIN_SUCCESS';
export const LOGIN_FAIL        = 'LOGIN_FAIL';
export const LOGOUT            = 'LOGOUT';

/* Sequência:
1) define o type
2) cria o arquivo do reducer que vai receber o type
3) cria o arquvivo no action que realiza a validação ao consulta o backend e despacha o evento para o component
4) cria o component que chama a action
5) inclui no reducers/index

*/