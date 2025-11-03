const express = require("express");
const router = express.Router();
const postController = require("../controller/post.controller.js");
const postValidation = require("../middleware/post_validation.js");
const verify = require("../middleware/verifyToken.js");
const avatar = require("../middleware/post_image_validation.js");


router.route('/').post(avatar.single("images"), verify.verifyToken,postValidation.createPostValidation() , postController.createPost)
                .put(avatar.single("images"), verify.verifyToken,postValidation.updateValidation() , postController.editPost)
router.route('/all').get(verify.verifyToken, postController.getAllPublicPosts);
router.route('/friends').get(verify.verifyToken, postController.getFriendsPosts);
router.route('/user/:userId').get(verify.verifyToken, postController.getUserPosts);
router.route('/:postId').get(verify.verifyToken,postValidation.getSinglePostValidation() , postController.getSinglePost)
                        .delete(verify.verifyToken,postValidation.deleteValidation() , postController.deletePost);




module.exports = router;

