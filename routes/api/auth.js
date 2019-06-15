const express = require("express");
const router  = express.Router();
// Importar middleware do token de autorização
const auth    = require("../../middleware/auth");
// Importar a model do Usuário
const User    = require("../../models/Users");
// Importar a biblioteca de validação dos inputs do formulário de login
const {check, validationResult}   = require("express-validator/check");
// Importar a biblioteca para pegar as senhas - config
const config  = require("config");
// Importar a biblioteca de criptografia
const bcrypt  = require("bcryptjs");
// Importar a biblioteca de webtokens
const jwt     = require("jsonwebtoken");

//@route    GET api/auth
//@desc     Rots de teste
//@access   Public

// Usamos um middleware para validar o token de autorização de acesso
// e depois obter no banco os dados do cliente conectado
router.get("/", auth, async(request, response)=>{
    try {
        // o request.user foi alterado pelo middleware auth para conter o id gravado no token
        // devemos selecionar os dados do usuário, exceto a senha
        // esqueci de colocar o await e deu erro...
        const user = await User.findById(request.user.id).select("-password");
        console.log(user);

        if (user)
        {
            response.json({user});
        }
        else
        {
            response.status(501).send("Server error");
        }

        
    } catch (error) {
        console.error(error.msg);
        response.status(501).send("Server error");
        
    }
});

//@route    POST api/auth
//@desc     Login de usuários
//@access   Public
//no segundo parâmetro, verificamos a existência do email e da senha

router.post("/",[
    check('email','Por favor, informe o email').exists(),
    check('password','Por favor, informe a senha').exists()
],
async (request, response)=>{
    const errors = validationResult(request);

    if (! errors.isEmpty() )
    {
        return response.status(400).json({errors : errors.array()});// colocar o return para interromper o processo aqui
    }

    const {email, password} = request.body; // desetruturação para receber somente alguns objetos

    try {

        // ATENÇÃO - USAR AWAIT ANTES DE TODAS AS FUNÇÕES QUE DEVOLVAM PROMISE
        // verifica se o usuário já existe
        let user = await User.findOne({ email });
        
        if (user)
        {
            // Para logar, precisamos validar a senha usando bcryptjs

            let isMatch= await bcrypt.compare(password,user.password);

            if (! isMatch )
            {
                return response.status(401).json({msg: "Invalid credentials"});
            }



            const payload = { user:{ id: user.id }};
            //  2) executo o método sign,cujo callback vai devolver o token
            //  enviando como parâmetros:
            //  payload, uma senha, objeto com parâmetros como expire e por último a definicao do call back
            //  nao uso await, porque vai chamar o call back
            let expiresIn = 3600; // uma hora para expirar o token
            jwt.sign(payload, config.get("senha_para_gerar_token"),{expiresIn},(err,token)=>{
                if (err) throw err;
                response.json({ token });
            });
        }
        else
        {
            return response.status(401).json({msg: "Invalid credentials"});  
        }


           
    } catch (error) {
        console.error(error);
        return response.status(401).json({msg: "Invalid credentials"});
        
    }
    
});




module.exports = router;