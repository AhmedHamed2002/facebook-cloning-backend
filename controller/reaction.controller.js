const Reaction = require("../models/reaction_modules.js");
const Post = require("../models/posts_modules.js");
const { validationResult , matchedData } = require("express-validator");
const httpsStatusText = require("../utils/httpStatusText");


// Add or update reaction 
const addReaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: httpsStatusText.FAIL, data: errors.array() });
    }

    const data = matchedData(req);

    const post = await Post.findById(data.postId);
    let  reaction  =  await Reaction.findOne({ postId: data.postId, userId: req.user.id });
    
    if (!post) {
      return res
        .status(404)
        .json({ status: httpsStatusText.FAIL, message: "Post not found" });
    }

    if (reaction) {
      reaction.type = data.type;
    } else {
      reaction = new Reaction({
        postId: data.postId,
        userId: req.user.id,
        type: data.type,
      });
    }
    await reaction.save();

    const existingReaction = post.likes.find(
      (r) => r.userId.toString() === req.user.id
    );

    if (existingReaction) {
      existingReaction.type = data.type;
    } else {
      post.likes.push({
        userId: req.user.id,
        type: data.type,
      });
    }

    await post.save();

    res.json({ status: httpsStatusText.SUCCESS, data: "done" });
  } catch (err) {
    res
      .status(500)
      .json({ status: httpsStatusText.ERROR, message: err.message });
  }
};

// Remove reaction
const removeReaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({status:httpsStatusText.FAIL , data: errors.array() });
    }

    const post = await Post.findById(req.body.postId);
    if (!post) return res.status(404).json({status:httpsStatusText.FAIL , data:"post not found"})

    const data =  matchedData(req) ;
    await Post.findOneAndDelete({ postId: data.postId, userId: req.user.id });
    await Reaction.findOneAndDelete({ postId: data.postId, userId: req.user.id });

    res.json({status:httpsStatusText.SUCCESS , data: "Reaction removed!" });
  } catch (err) {
    res.status(500).json({status:httpsStatusText.ERROR , message: err.message });
  }
};

// Get reactions
const getReactions = async (req, res) => {
  try {
    const errors = validationResult(req) ; 
    if (!errors.isEmpty()) {
      return res.status(400).json({status:httpsStatusText.FAIL , data: errors.array() });
    }
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({status:httpsStatusText.FAIL , data:"post not found"})

    const reactions = await Reaction.find({ postId: req.params.postId })
      .populate("userId", "name profileImage");

      if(!reactions) return res.status(404).json({status:httpsStatusText.FAIL , data:"reactions not found"})
      
    res.json({status:httpsStatusText.SUCCESS , data:reactions , authorId:post.authorId });
  } catch (err) {
    res.status(500).json({status:httpsStatusText.ERROR , message: err.message });
  }
};

module.exports = {
  addReaction,
  removeReaction,
  getReactions,
};

