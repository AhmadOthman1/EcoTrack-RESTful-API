const express=require('express');
const signUpController=require('../controller/userProfileController/signUp')
const loginController=require('../controller/userProfileController/logIn')
const logoutController=require('../controller/userProfileController/logOut')
const { authenticateToken } = require('../controller/authController');
const authController=require('../controller/authController')
const userProfile=require('../controller/userProfileController/profileInfo')
const getDBLocations=require('../controller/getLocations')


const router=express.Router();
//auth
router.post('/signup',signUpController.postSignup);
router.post('/verificationCode',signUpController.postVerificationCode);
router.post('/login',loginController.postLogin);
router.post('/logout',authenticateToken,logoutController.postLogOut);
router.post('/refreshToken', authController.getRefreshToken);
router.get('/user/myProfile',authenticateToken, userProfile.getProfileInfo);
router.get('/locations',getDBLocations.getLocations);



module.exports=router;