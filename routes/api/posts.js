const express = require("express");
const router   = express.Router();

//@route    GET api/posts
//@desc     Rota de teste
//@access   Public

router.get("/", (request, response)=>{
    response.send("api/posts");
});


module.exports = router;