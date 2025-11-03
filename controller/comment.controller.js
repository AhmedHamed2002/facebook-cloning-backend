const { validationResult , matchedData } = require("express-validator");
const Post = require("../models/posts_modules.js");
const httpsStatusText = require("../utils/httpStatusText");

// Add comment
const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({status:httpsStatusText.FAIL , data: errors.array() });
    }

    const data = matchedData(req);

    const post = await Post.findByIdAndUpdate(
        req.params.postId,
      { $push: { comments: { userId:req.user.id, text:data.text } } },
      { new: true }
    ).populate("comments.userId", "name profileImage");

    if (!post) {
      return res.status(404).json({status:httpsStatusText.FAIL , data: "Post not found" });
    }

    res.json({status:httpsStatusText.SUCCESS , data:"Comment added!" });
  } catch (err) {
    res.status(500).json({status:httpsStatusText.ERROR , message: err.message });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({status:httpsStatusText.FAIL , data: errors.array() });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ status:httpsStatusText.FAIL , data: "Post not found" });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ status:httpsStatusText.FAIL , data: "Comment not found" });
    }

    if (
      post.authorId.toString() !== req.user.id.toString() && 
      comment.userId.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ status:httpsStatusText.FAIL , data: "Not authorized to delete this comment" });
    }

    comment.deleteOne(); 
    await post.save();

    res.json({ status:httpsStatusText.SUCCESS, data: "Comment deleted!" });
  } catch (err) {
    res.status(500).json({status:httpsStatusText.ERROR , message: err.message });
  }
};


// Get comments
const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("comments.userId", "name profileImage");
    
    if (!post) {
      return res.status(404).json({status:httpsStatusText.FAIL , data: "Post not found" });
    }

    res.json({status:httpsStatusText.SUCCESS , data:post.comments , authorId:post.authorId , userId:req.user.id });
  } catch (err) {
    res.status(500).json({status:httpsStatusText.ERROR , message: err.message });
  }
};

module.exports = {
  addComment,
  deleteComment,
  getComments,
}; 
