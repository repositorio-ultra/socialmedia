const express  = require("express");
const router   = express.Router();
const {check, validationResult} = require("express-validator/check");
const auth     = require("../../middleware/auth");
const User     = require("../../models/Users");
const Post     = require("../../models/Posts");

//@route    POST api/posts
//@desc     inclusão de posts
//@access   Private

router.post("/", [auth,[ check('text', 'Text is required').not().isEmpty()]], async (request, response)=>{
    try {
        const errors = validationResult(request);

        if (! errors.isEmpty())
        {
            return response.status(401).json({errors : errors.array()});
        }

        const newText = {
            user: request.user.id,
            text: request.body.text
        }

        const post  = new Post(newText);


       const postSaved = await post.save();

        response.json(postSaved);

        
        
    } catch (error) {
        console.log(error.message);
        response.status(500).json('Server error');
    }
});

//@route    GET api/posts
//@desc     Listar os posts
//@access   Private

router.get("/", auth, async (request, response)=>{
    
    try {
        const posts = await Post.find();
        if (posts)
        {
            return response.json({posts});
        }

        response.status(500).json({msg: "Server Error"});

        

    } catch (error) {
        console.log(error.message);
    }

});

//@route    GET api/posts/user/:postid
//@desc     Seleciona um post específico de um usuário
//@access   Private 

router.get("/user/:postid", auth, async (request, response)=>{
    
    try {
        const user  = await User.findOne({ _id: request.user.id }).select("-password");
        const posts = await Post.findOne({_id: request.params.postid, user: user._id});
        //console.log(user.id.toString()); Tem que ser assim
        if (posts)
        {
            return response.json({posts});
        }
        else
        {
            return response.json({ msg: "No posts from this user"});
        }

    } catch (error) {
        console.log(error.message);
        response.status(500).json({msg: "Server Error"});
    }

});


//@route    GET api/posts/:postid
//@desc     Seleciona um post por id
//@access   Private 

router.get("/:postid", auth, async (request, response)=>{
    
    try {
        const posts = await Post.findOne({_id: request.params.postid});
        // pode ser: await Post.findById(request.params.postid);
        if (posts)
        {
            return response.json({posts});
        }
        else
        {
            return response.json({ msg: "Post not found"});
        }

    } catch (error) {
        console.log(error.message);
        response.status(500).json({msg: "Server Error"});
    }

});

//@route    DELETE api/posts/:postid
//@desc     Deletar uma post de usuário
//@access   Private

router.delete("/:postid",auth, async (request, response)=>{
    
    try {
        const user  = await User.findOne({ _id: request.user.id }).select("-password");
        const posts = await Post.findOneAndDelete({_id: request.params.postid, user: user._id});
        
        response.json({msg: "Post deleted"});

    } catch (error) {
        console.log(error.message);
        response.status(500).send("Erro de servidor"); 
    }
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      // Check if the post has already been liked
      if (
        post.likes.filter(like => like.user.toString() === req.user.id).length > 0
      ) {
        return res.status(400).json({ msg: 'Post already liked' });
      }
  
      post.likes.unshift({ user: req.user.id });
  
      await post.save();
  
      res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // @route    PUT api/posts/unlike/:id
  // @desc     Like a post
  // @access   Private
  router.put('/unlike/:id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      // Check if the post has already been liked
      if (
        post.likes.filter(like => like.user.toString() === req.user.id).length ===
        0
      ) {
        return res.status(400).json({ msg: 'Post has not yet been liked' });
      }
  
      // Get remove index
      const removeIndex = post.likes
        .map(like => like.user.toString())
        .indexOf(req.user.id);
  
      post.likes.splice(removeIndex, 1);
  
      await post.save();
  
      res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // @route    POST api/posts/comment/:id
  // @desc     Comment on a post
  // @access   Private
  router.post(
    '/comment/:id',
    [
      auth,
      [
        check('text', 'Text is required')
          .not()
          .isEmpty()
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
  
        const newComment = {
          text: req.body.text,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id
        };
  
        post.comments.unshift(newComment);
  
        await post.save();
  
        res.json(post.comments);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
  
  // @route    DELETE api/posts/comment/:id/:comment_id
  // @desc     Delete comment
  // @access   Private
  router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      // Pull out comment
      const comment = post.comments.find(
        comment => comment.id === req.params.comment_id
      );
  
      // Make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }
  
      // Check user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      // Get remove index
      const removeIndex = post.comments
        .map(comment => comment.id)
        .indexOf(req.params.comment_id);
  
      post.comments.splice(removeIndex, 1);
  
      await post.save();
  
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  



module.exports = router;