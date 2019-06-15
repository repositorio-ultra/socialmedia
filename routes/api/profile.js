const express  = require("express");
const router   = express.Router();
// Importar models
const Profile  = require("../../models/Profile");
const User     = require("../../models/Users");
// Importar middleware
const auth     = require("../../middleware/auth");
// IMporta a biblioteca para validação do input dos profiles
const {check, validationResult} = require ("express-validator/check");

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
        
        response.json({msg: "Nenhum profile encontrado"});

    } catch (error) {
        console.log(error.message);
        response.status(500).send("Erro de servidor, na obtençao dos profiles"); 
    }
});


//@route    GET api/profile/me
//@desc     Meu Profile
//@access   Private

// preciso usar o middleware de autenticaçao
// sempre que usar asyn, envelopar com try catch

router.get("/me", auth, async (request, response)=>{

    try {
        const profile = await Profile.findOne({ user: request.user.id })// request.user.id se torna disponível pelo uso do middelware
                                        .populate('user',['name','avatar']);//cuidado aqui 'user' é a chave estrangeira que na model deve apontar corretamente para o nome da collection
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
      profileFields.skills = skills.split(',').map(skill => skill.trim());
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



module.exports = router;