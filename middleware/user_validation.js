const {body}  =  require('express-validator') ;
const Roles = require('../utils/roles');

const  registerValidation = () =>{
    return [
        body('name')
            .notEmpty().withMessage('firstName is required'),
            
        body('email')
            .notEmpty().withMessage('email is required')
            .isEmail().withMessage('email is invalid'),
            
        body("gender")
            .notEmpty().withMessage("Gender is required")
            .isIn(["male", "female"]).withMessage("Gender must be male, female, or other"),

        body("address")
            .notEmpty().withMessage("Address is required")
            .isString().withMessage("Address must be a string")
            .trim(),

        body("city")
            .notEmpty().withMessage("City is required")
            .isString().withMessage("City must be a string")
            .trim(),

        body("birthday")
            .notEmpty().withMessage("Birthday is required")
            .isISO8601().withMessage("Birthday must be a valid date")
            .toDate() ,

        body("phone")
            .notEmpty().withMessage("Phone number is required")
            .isMobilePhone().withMessage("Invalid phone number")
            .trim(),

        body('password')
            .notEmpty().withMessage('password is required')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).withMessage('Password must contain at least one letter and one number') , 
        
            body('confirmPassword')
            .notEmpty().withMessage('Confirm password is required')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                throw new Error('Passwords do not match');
                }
                return true;
            }),
        
            body('profileImage')
            .default('https://res.cloudinary.com/dtnkj1dqe/image/upload/v1758109447/Facebook/users/profile/jibu3d0moicrpb3lusg2.jpg'),

            body('profileImage_public_id')
            .default('Facebook/users/profile/jibu3d0moicrpb3lusg2.jpg')
    ] ; 
}

const  loginValidation = () =>{
    return [
        body('email')
            .notEmpty().withMessage('email is required')
            .isEmail().withMessage('email is invalid'),   
        body('password')
            .notEmpty().withMessage('password is required') 
    ] ; 
}

const  profileValidation = () =>{
    return [
        body('name') 
            .optional()
            .notEmpty().withMessage('value is required'),

        body('bio')
            .optional()
            .notEmpty().withMessage('value is required'),

        body("gender")
            .optional()
            .notEmpty().withMessage("Gender is required")
            .isIn(["male", "female"]).withMessage("Gender must be male, female, or other"),

        body("address")
            .optional()
            .notEmpty().withMessage("Address is required")
            .isString().withMessage("Address must be a string")
            .trim(),

        body("city")
            .optional()
            .notEmpty().withMessage("City is required")
            .isString().withMessage("City must be a string")
            .trim(),

        body("birthday")
            .optional()
            .notEmpty().withMessage("Birthday is required")
            .isISO8601().withMessage("Birthday must be a valid date")
            .toDate() ,

        body("phone")
            .optional()
            .notEmpty().withMessage("Phone number is required")
            .isMobilePhone().withMessage("Invalid phone number")
            .trim(),
            
        body('email')
            .optional()
            .isEmail().withMessage('email is invalid'),

        body('profileImage')
            .optional()
            .default('https://res.cloudinary.com/dtnkj1dqe/image/upload/v1758109447/Facebook/users/profile/jibu3d0moicrpb3lusg2.jpg') ,
        
        body('profileImage_public_id')
        .optional()
        .default('Facebook/users/profile/jibu3d0moicrpb3lusg2.jpg') ,
    
        body('backgroundImage')
        .optional()
        .default('https://res.cloudinary.com/dtnkj1dqe/image/upload/v1757591957/Facebook/users/background/facebook_bvtj5r.jpg') ,
    
        body('backgroundImage_public_id')
        .optional()
        .default('Facebook/users/background/facebook_bvtj5r.jpg')
        
    ] ; 
}

const forgetPasswordValidation = () =>{
    return [
        body('email')
            .isEmail().withMessage('email is invalid'),
    ]
}

const resetPasswordValidation = () =>{
    return [
        body('email')
            .isEmail().withMessage('email is invalid'),
        body('newPassword')
            .notEmpty().withMessage('password is required')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).withMessage('Password must contain at least one letter and one number') , 
        body("code")
        .isLength({ min: 6, max: 6 })
        .withMessage("Reset code must be 6 digits long")
        .isNumeric()
        .withMessage("Reset code must contain only numbers"),
        ]
}


module.exports= {
    registerValidation , 
    loginValidation , 
    profileValidation ,
    forgetPasswordValidation , 
    resetPasswordValidation
}