// Importar a biblioteca para trabalhar com o token
const jwt = require("jsonwebtoken");
// Importar a bilblioteca para trazer o senha do token
const config = require("config");

// como é um middleware, vamos exportar a função que vai receber
// como parâmetros o request, o response e como em todo middleware o next

module.exports = function (request, response, next){
    // Obtem o token do header da requisição
    const token = request.header("x-auth-token");// x-auth-token é o nome padrão do header onde guardamos o token

    // Se não houver o token, devolve o erro
    if (! token)
    {
       return response.status(401).json({ msg: "Token não encontrado, acesso proibido"});
    }

    try {
        // se houver o token, validamos

        const decoded = jwt.verify(token, config.get("senha_para_gerar_token"));

        // setamos o id da requisição com os dados da decodificação

        request.user = decoded.user;

        // seguimos

        next();
    } catch (error) {

        return response.status(401).json({msg: "Token inválido, acesso proibido"});
        
    }
}