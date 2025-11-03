const { body } = require("express-validator");

const sendFriendRequest = () => {
    return [
        body("toId")
            .notEmpty().withMessage("ID is required")
            .isMongoId().withMessage("Invalid ID format"),
    ];
};

const acceptandRejectFriendRequest = () => {
    return [
        body("fromId")
            .notEmpty().withMessage("ID is required")
            .isMongoId().withMessage("Invalid ID format"),
    ]
}

const removeFriend = () => {
    return [
        
        body("friendId")
            .notEmpty().withMessage("ID is required")
            .isMongoId().withMessage("Invalid ID format"),
    ]
}

module.exports = { sendFriendRequest , acceptandRejectFriendRequest, removeFriend };