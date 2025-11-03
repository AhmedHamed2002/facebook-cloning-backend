const { body, param } = require("express-validator");

const addReactionValidation = ()=>{
    return [
        body("postId").isMongoId().withMessage("Invalid postId"),
        body("type")
            .isIn(["like", "love", "haha", "wow", "sad", "angry"])
            .withMessage("Invalid reaction type"),
    ];
}

const removeReactionValidation = ()=>{
    return [
        body("postId").isMongoId().withMessage("Invalid postId"),
    ];
}

const getReactionsValidation = ()=>{
    return [
        param("postId").isMongoId().withMessage("Invalid postId"),
    ];
}

module.exports = {
    addReactionValidation,
    removeReactionValidation,
    getReactionsValidation,
};

