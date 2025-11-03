const express = require("express");
const router = express.Router();
const reactionController = require("../controller/reaction.controller.js");
const reactionValidation = require("../middleware/reaction_validation.js");
const  verify  = require("../middleware/verifyToken.js");



router.route('/').post(verify.verifyToken , reactionValidation.addReactionValidation(), reactionController.addReaction)
                .delete(verify.verifyToken , reactionValidation.removeReactionValidation(), reactionController.removeReaction);
router.route('/:postId').get(verify.verifyToken , reactionValidation.getReactionsValidation(), reactionController.getReactions);

module.exports = router;
