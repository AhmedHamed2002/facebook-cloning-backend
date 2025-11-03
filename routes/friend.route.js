const express = require("express");
const router = express.Router();
const friendshipController = require("../controller/friendship.controller");
const friendshipValidation = require("../middleware/friendship_validation");
const verify = require("../middleware/verifyToken");

router.route('/request').post(verify.verifyToken , friendshipValidation.sendFriendRequest() , friendshipController.sendFriendRequest );
router.route('/accept').post(verify.verifyToken , friendshipValidation.acceptandRejectFriendRequest() , friendshipController.acceptFriendRequest );
router.route('/reject').post(verify.verifyToken , friendshipValidation.acceptandRejectFriendRequest() , friendshipController.rejectFriendRequest );
router.route('/remove').post(verify.verifyToken , friendshipValidation.removeFriend() , friendshipController.removeFriend );

module.exports = router ; 