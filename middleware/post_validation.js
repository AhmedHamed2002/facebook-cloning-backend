const { body  , param} = require("express-validator");

const createPostValidation = () => {
    return [
        body("content")
            .notEmpty().withMessage("Content is required")
            .isLength({ min: 3 }).withMessage("Content must be at least 3 characters"),
        body("visibility")
            .optional()
            .isIn(["public", "friends", "private"]).withMessage("Invalid visibility value"),
        body('images')
            .optional()
    ];
};

const getSinglePostValidation = () => {
    return [
        param("userId")
            .notEmpty().withMessage("ID is required")
            .isMongoId().withMessage("Invalid ID format"),
    ]
}
const updateValidation = () => {
    return [
        body("postId")
            .notEmpty().withMessage("ID is required")
            .isMongoId().withMessage("Invalid ID format"),
        body("content")
            .optional()
            .notEmpty().withMessage("Content is required")
            .isLength({ min: 3 }).withMessage("Content must be at least 3 characters"),
        body("visibility")
            .optional()
            .isIn(["public", "friends", "private"]).withMessage("Invalid visibility value"),
        body('images')
            .optional()
    ];
};

const  deleteValidation = () =>{
    return [
        param("postId")
            .notEmpty().withMessage("ID is required")
            .isMongoId().withMessage("Invalid ID format"),
    ]
}

module.exports = { createPostValidation , getSinglePostValidation , updateValidation , deleteValidation };
