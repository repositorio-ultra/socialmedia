const express  = require("express");
const router   = express.Router();
// Importar models
const Profile  = require("../../models/Profile");
const User     = require("../../models/Users");
// Importar middleware
const auth     = require("../../middleware/auth");
// IMporta a biblioteca para validação do input dos profiles
const {check, validationResult} = require ("express-validator/check");
// Importar a biblioteca para requisiçõe a APIs externas
const requestapi  = require("request");
const config   = require("config");

//@route    GET api/profile
//@desc     Listar os profiles
//@access   Public

router.get("/", async (request, response)=>{
    
    try {
        let profile = await Profile.find().populate('user',['name', 'avatar']);

        if(profile)
        {
            return response.json(profile);
        }
        
        response.status(400).json({msg: "Nenhum profile encontrado"});

    } catch (error) {
        console.log(error.message);
        response.status(500).send("Erro de servidor, na obtençao dos profiles"); 
    }
});

//@route    GET api/profile/user/:id
//@desc     Listar o profile de um usuário específico
//@access   Public

router.get("/user/:userid", async (request, response)=>{
    
    try {
        let profile = await Profile.findOne({user: request.params.userid }).populate('user',['name', 'avatar']);

        if(profile)
        {
            return response.json(profile);
        }
        
        response.status(400).json({msg: "Nenhum profile deste usuário encontrado"});

    } catch (error) {
        console.log(error.message);
        // Caso o tipo de erro seja do id do usuário num formato inválido
        if (error.kind == 'Object')
        {
           return response.status(400).json({msg: "Profile não encontrado"}); 
        }
        response.status(500).send("Erro de servidor, na obtençao do profile"); 
    }
});


//@route    GET api/profile/me
//@desc     Meu Profile
//@access   Private

// preciso usar o middleware de autenticaçao
// sempre que usar asyn, envelopar com try catch

router.get("/me", auth, async (request, response)=>{

    try {
        const profile = await Profile.findOne({ user: request.user.id });// request.user.id se torna disponível pelo uso do middelware
                                        //.populate('user',['name','avatar']);//cuidado aqui 'user' é a chave estrangeira que na model deve apontar corretamente para o nome da collection
        if (! profile)
        {
            return response.status(400).json({msg: "No profile found for this user" });
        }

        response.json(profile);

    } catch (error) {

        console.error(error.message);
        return response.status(500).send("No profile found for this user");
        
    } 
});

//@route    POST api/profile
//@desc     criar ou atualizar profile de usuário
//@access   Private

router.post("/",[
    auth,
    [
        check('status','Informe o status').not().isEmpty(),
        check('skills','Informe pelo menos um skill').not().isEmpty()
    ]
],
async (request, response)=>{
    const errors = validationResult(request);

    if (! errors.isEmpty() )
    {
        return response.status(400).json({errors : errors.array()});// colocar o return para interromper o processo aqui
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = request.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = request.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        let skills2 = skills.toString();
        //console.log("Habilidades " + skills2);
        profileFields.skills = skills2.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;


    try {

        let profile = await Profile.findOne({user: request.user.id});

        if (profile)
        {
            // Update
            profile = await Profile.findOneAndUpdate(
                {user: request.user.id},
                {$set: profileFields},
                {new: true}
            );

            profile = await Profile.findOne({user: request.user.id}).populate('user',['name','avatar']);

           return response.json(profile);// para parar aqui
        }

        // create

        profile = new Profile(profileFields);

        await profile.save(profile);

        response.json(profile);
        
    } catch (error) {
        console.error(error.message);
        response.status(500).json({msg: "Erro no cadastro do profile"});
    }
});

//@route    DELETE api/profile
//@desc     Deletar profile, posts e usuário
//@access   Private

router.delete("/",auth, async (request, response)=>{
    
    try {
            //remover o profile    
            await Profile.findOneAndRemove({ user : request.user.id});

            //remover o usuário   
            await User.findOneAndRemove({ _id : request.user.id});

            response.json({ msg: "Usuário e perfil deletados"}); 

    } catch (error) {
        console.log(error.message);
        response.status(500).send("Erro de servidor"); 
    }
});

//@route    PUT api/profile/experience
//@desc     Atualiza o profile, inserindo uma experiência
//@access   Private

router.put("/experience",[
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ], async (request, response)=>{
    
    try {
            
            const errors = validationResult(request);
            
            if (! errors.isEmpty())
            {
                return response.status(401).json({errors: errors.array()});
            }
            
            // Busca o perfil do usuário
            const profile =  await Profile.findOne({user: request.user.id});
            console.log(profile);

            // Obtem os dados do formulário e Monta o Objeto com a nova experiência
            const {
                title,
                company,
                location,
                from,
                to,
                current,
                description
              } = request.body;
          
              const newExp = {
                title,
                company,
                location,
                from,
                to,
                current,
                description
              };

            // insere no início objeto experience do objeto profile
            profile.experience.unshift(newExp);

            // salva o objeto no banco
            profile.save();

            // Devolve o profile novo cadastrado
            response.json(profile); 

    } catch (error) {
        console.log(error.message);
        response.status(500).send("Erro de servidor"); 
    }
});

//@route    DELETE api/profile/experience/:exp_id
//@desc     Deletar uma experiencia do profile
//@access   Private

router.delete("/experience/:exp_id",auth, async (request, response)=>{
    
    try {
            //obter o profile   
            const profile = await Profile.findOne({ user : request.user.id });

            //mapear as experiencias no profile  
            const indexToRemove = profile.experience.map(item => item.id).indexOf(request.params.exp_id);
            //console.log(profile.experience.map(item => item.id));// Traz um array com os ids das experiencies
            //console.log("request "+ request.params.exp_id);

            // remover a experience do objeto informando o index do objeto e a quantidade de objetos para remover como params
            profile.experience.splice(indexToRemove, 1);

            // salva o profile
            await profile.save();

            // retorna o profile para a view;

            response.json(profile); 

    } catch (error) {
        console.log(error.message);
        response.status(500).send("Erro de servidor"); 
    }
});

//@route    PUT api/profile/education
//@desc     Atualiza o profile, inserindo uma formação acadêmica
//@access   Private

router.put("/education",[
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
    check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ], async (request, response)=>{
    
    try {
            
            const errors = validationResult(request);
            
            if (! errors.isEmpty())
            {
                return response.status(401).json({errors: errors.array()});
            }
            
            // Busca o perfil do usuário
            const profile =  await Profile.findOne({user: request.user.id});
            //console.log(profile);

            // Obtem os dados do formulário e Monta o Objeto com a nova experiência
            const {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description
              } = request.body;
          
              const newEdu = {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description
              };

            // insere no início objeto education do objeto profile
            profile.education.unshift(newEdu);

            // salva o objeto no banco
            profile.save();

            // Devolve o profile novo cadastrado
            response.json(profile); 

    } catch (error) {
        console.log(error.message);
        response.status(500).send("Erro de servidor"); 
    }
});

//@route    DELETE api/profile/education/:edu_id
//@desc     Deletar uma experiencia do profile
//@access   Private

router.delete("/education/:edu_id",auth, async (request, response)=>{
    
    try {
            //obter o profile   
            const profile = await Profile.findOne({ user : request.user.id });

            //mapear as experiencias no profile  
            const indexToRemove = profile.education.map(item => item.id).indexOf(request.params.edu_id);
            //console.log(profile.education.map(item => item.id));// Traz um array com os ids das experiencies
            //console.log("request "+ request.params.exp_id);

            // remover a education do objeto informando o index do objeto e a quantidade de objetos para remover como params
            if ( indexToRemove != -1)
            {
                profile.education.splice(indexToRemove, 1);

            }

            // salva o profile
            await profile.save();

            // retorna o profile para a view;

            response.json(profile); 

    } catch (error) {
        console.log(error.message);
        response.status(500).send("Erro de servidor"); 
    }
});

//@route    GET api/profile/github/:username
//@desc     Acessar os dados do repositório do usuário no GitHub
//@access   Public


router.get("/github/:username", (request, response)=>{

    try {

        const options = {
            uri: `https://api.github.com/users/${request.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubclientid')}&client_secret=${config.get('githubpassword')}`,
            method: 'GET',
            headers: {'user-agent':  'nodejs'}
        }
        
        requestapi(options,(error, responseapi, body)=>{

            if(error) console.log(error);

            if(responseapi.statusCode !== 200)
            {
               return response.status(404).json({ msg : "Repos not found"});
            }
            else
            {
                response.json(JSON.parse(body));
            }

        });
     

    } catch (error) {

        console.error(error.message);
        return response.status(500).send("No repo found for this user");
        
    } 
});

module.exports = router;