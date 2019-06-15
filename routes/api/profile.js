const express  = require("express");
const router   = express.Router();
// Importar models
const Profile  = require("../../models/Profile");
const User     = require("../../models/Profile");
// Importar middleware
const auth     = require("../../middleware/auth");
// IMporta a biblioteca para validação do input dos profiles
const {check, validationResult} = require ("express-validator/check");

//@route    GET api/profile
//@desc     Rota de teste
//@access   Public

router.get("/", (request, response)=>{
    response.send("api/profile");
});


//@route    GET api/profile/me
//@desc     Meu Profile
//@access   Private

// preciso usar o middleware de autenticaçao
// sempre que usar asyn, envelopar com try catch

router.get("/me", auth, async (request, response)=>{

    try {
        const profile = Profile.findOne({ user: request.user.id })
                                        .populate('user',[name, avatar]);// request.user.id se torna disponível pelo uso do middelware
        
        if (! profile)
        {
            return response.status(400).json({msg: "No profile found for this user" });
        }

        response.json(profile);

    } catch (error) {

        console.error(error.message);
        return response.status(500).send("Server Error for Profile Retrieval");
        
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
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
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
});



module.exports = router;