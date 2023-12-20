const express=require('express');
const signUpController=require('../controller/userProfileController/signUp')


const router=express.Router();
//auth
router.post('/signup',signUpController.postSignup);
router.post('/verificationCode',signUpController.postVerificationCode);

//router.post('/login',signUpController.login)
module.exports=router;