const express  = require("express");
const router   = express.Router();
// Pegar o avatar - ícone - do usuário
const gravatar   = require("gravatar");
// Importar a biblioteca para criptografar a senha
const bcrypt   = require("bcryptjs");
// Importar a biblioteca para geração do token
const jwt      = require("jsonwebtoken");
// Importar a biblioteca config para trazer a senha para gerar o token
const config   = require("config"); 
// com destructuring trato alguns métodos do express-validator
const {check, validationResult} = require("express-validator/check");
// requisita a model
const User = require("../../models/Users");

//@route    GET api/users
//@desc     Rots de teste
//@access   Public
router.get("/", (request, response)=>{
    response.send("api/users");
});

//@route    POST api/users
//@desc     Cadastro de usuários
//@access   Public
//no segundo parâmetro, enviamos um array com regras que queremos testar - campo, mensagem e o que validar

router.post("/",[
                    check('name','O nome é obrigatório').not().isEmpty(),
                    check('email','O email é obrigatório').isEmail(),
                    check('password','Informe um password de pelo menos 6 caracteres').isLength({ min:6})
                ],
                async (request, response)=>{
                    const errors = validationResult(request);

                    if (! errors.isEmpty() )
                    {
                        return response.status(400).json({errors : errors.array()});// colocar o return para interromper o processo aqui
                    }

                    const {name, email, password} = request.body; // desetruturação para receber somente alguns objetos

                    try {

                        // ATENÇÃO - USAR AWAIT ANTES DE TODAS AS FUNÇÕES QUE DEVOLVAM PROMISE
                        // verifica se o usuário já existe
                        let user = await User.findOne({ email });
                        
                        if (user)
                        {
                            return response.status(400).json({errors :[{msg: "User already exists"}] });
                        }

                        // se não existir, pega o avatar e cria um novo objeto para inserir no banco

                        const avatar = await gravatar.url(email,{
                            s: "200", // para o tamanho
                            r: "pg", // para o rating
                            d: "mm" // não sei
                        });

                        // não preciso fazer name: name, email: email, porque possuem os mesmos nomes - ES6
                        user = new User({
                                name,
                                email,
                                password,
                                avatar
                        });

                        // Antes de gravar, vamos criptografar a senha usando bcryptjs

                        const salt =  await bcrypt.genSalt(10);

                        user.password = await bcrypt.hash(password,salt);

                        // gravar no banco

                        await user.save()
                        
                        // Obter o token JWT baseado no id do registro
                        // 1) Preciso do id do usuário gravado, qque será chamado de payload

                        const payload = { user:{ id: user.id }};
                        //  2) executo o método sign,cujo callback vai devolver o token
                        //  enviando como parâmetros:
                        //  payload, uma senha, objeto com parâmetros como expire e por último a definicao do call back
                        //  nao uso await, porque vai chamar o call back
                        let expiresIn = 3600*1000; // uma hora para expirar o token
                        jwt.sign(payload, config.get("senha_para_gerar_token"),{expiresIn},(err,token)=>{
                            if (err) throw err;
                            response.json({ token });
                        });


                           
                    } catch (error) {
                        console.error(error);
                        return response.status(400).json([{msg:"Erro de inserção"}]);
                        
                    }
                    

                    //user.findOne().then(); formato usando promises sem o asyn antes de (request,response)


                    //console.log(request.body);//request.body Fica disponível depois de acionar no app - server o body parser express.json()
                    
                });


module.exports = router;