const express=require('express');
const userController=require('../controller/userController')


const router=express.Router();
//auth
router.get('/signup',userController.postSignup);
router.get('/login',userController.login);
//router.post('/post',userController.createPost)
module.exports=router;