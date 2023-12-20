const express=require('express');
const signUpController=require('../controller/userProfileController/signUp')
const loginController=require('../controller/userProfileController/logIn')


const router=express.Router();
//auth
router.post('/signup',signUpController.postSignup);
router.post('/verificationCode',signUpController.postVerificationCode);
router.post('/login',loginController.postLogin);




module.exports=router;