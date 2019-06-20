/*
Sequencia para criar o reducer
1) Criar o estado inicial, com os campos que se deseja controlar,
serão necessária ações para pegar os profiles, criar, editar e excluir

2) exportar uma função, que recebe o um estado, cujo padrão é o estado inicial, e ação a ser executada
esta ação é um tipo definido no arquivo /action/types.js. Esta ação pode ser desestruturada, porque vamos utilizar
o tipo e o payload - que são os dados -

3) ao recebe o tipo de acão,  a função retorna o objeto inicial com os campos nos preenchidos ou alterados
...state copia os campos do state enviado no parâmetro. As demais linhas alteram os campos importando atrubuindo
os valores recebidos no action.payload

*/
import { GET_PROFILE,PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE, GET_PROFILES, GET_REPOS } from '../actions/types'


const initialState = {
    profile: null, /* pegar todos os dados de nosso profile e dos outros que visitarmos */
    profiles: [], /*lista de developers */
    respos: [], /* lista de repositório */
    loading: true, /* depois de carregar o request é setado para falso */
    error : {}
}

export default function (state = initialState, action){

    /* no GET_PROFILE o action.payload traz o perfil e setamos o loading para false porque conclui a consulta a banco
    no PROFILE_ERROR o payload traz as mensagens de erro e status */


    switch (action.type)
    {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return{
                ...state,
                profile: action.payload,
                loading: false
            }
            
        case GET_PROFILES:
                return{
                    ...state,
                    profiles: action.payload,
                    loading: false
                }
        
        case PROFILE_ERROR:
                return{
                    ...state,
                    error: action.payload,
                    loading: false
                }
        
        case CLEAR_PROFILE:
                return{
                    ...state,
                    profile: null,
                    profiles:[],
                    repos: [],
                    error: {},
                    loading: false
                }
        case GET_REPOS:
                return{
                    ...state,
                    repos: action.payload,
                    loading: false
                }

        default:
            return state;
    }
}