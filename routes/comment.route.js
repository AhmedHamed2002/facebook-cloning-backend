const express = require("express");
const router = express.Router();
const commentController  = require("../controller/comment.controller.js");
const commentValidation = require("../middleware/comment_validation.js");
const  verify  = require("../middleware/verifyToken.js");



router.route('/:postId').get(verify.verifyToken, commentController.getComments)
                        .post(verify.verifyToken, commentValidation.addCommentValidation(), commentController.addComment);
router.route('/:postId/:commentId').delete(verify.verifyToken, commentValidation.deleteCommentValidation(), commentController.deleteComment)

module.exports = router;
