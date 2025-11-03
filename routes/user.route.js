const express =  require('express');
const router = express.Router() ;  
const userController = require('../controller/user.controller');
const userValidation  = require('../middleware/user_validation');
const verify =  require('../middleware/verifyToken');
const uploadBoth =  require('../middleware/user_image_validation'); 


router.route('/').get(verify.verifyToken ,userController.getAllUsers) ;
router.route('/image').get(verify.verifyToken ,userController.imageUser) ;
router.route('/search').get(verify.verifyToken ,userController.search) ;
router.route('/register').post(uploadBoth.fields([{ name: "profileImage", maxCount: 1 }, { name: "backgroundImage", maxCount: 1 }]), userValidation.registerValidation(),userController.register) ; 
router.route('/login').post(userValidation.loginValidation(),userController.login) ;  
router.route('/check').get(verify.verifyToken,userController.check) ;  
router.route('/logout').get(verify.verifyToken,userController.logout) ;  
router.route('/forgot-password').post(userValidation.forgetPasswordValidation(), userController.forgotPassword);
router.route('/reset-password').post(userValidation.resetPasswordValidation(), userController.resetPassword);
router.route('/profile').get(verify.verifyToken,userController.profile) 
                        .put(uploadBoth.fields([{ name: "profileImage", maxCount: 1 }, { name: "backgroundImage", maxCount: 1 }]) , verify.verifyToken,userValidation.profileValidation() ,userController.updateProfile);
router.route('/:id').get(verify.verifyToken  , userController.getSingleUser) ;

module.exports = router ; 