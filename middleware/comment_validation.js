const { body, param } = require("express-validator");

const  addCommentValidation = ()=> {
  return [
    param("postId").isMongoId().withMessage("Invalid postId"),
    body("text").isString().isLength({ min: 1 }).withMessage("Comment text is required"),
  ]; 
}

const  deleteCommentValidation = ()=> {
  return [
    param("postId").isMongoId().withMessage("Invalid postId"),
    param("commentId").isMongoId().withMessage("Invalid commentId"),
  ]; 
}

module.exports = {
  addCommentValidation,
  deleteCommentValidation,
};

