const express=require('express');
const signUpController=require('../controller/userProfileController/signUp')
const loginController=require('../controller/userProfileController/logIn')
const logoutController=require('../controller/userProfileController/logOut')
const { authenticateToken } = require('../controller/authController');
const authController=require('../controller/authController')
const userProfile=require('../controller/userProfileController/profileInfo')
const getDBLocations=require('../controller/getLocations')
const getDBInterests=require('../controller/getInterests')
const searchLocaions=require('../controller/search/locations')
const searchInterests=require('../controller/search/interests')
const globalSearchController = require('../controller/search/globalSearch');
const educationalSearchController = require('../controller/search/educationalSearchController'); 
const dataSearchController = require('../controller/search/dataSearchController'); // Adjust the path as necessary
const communityReportsSearchController = require('../controller/search/communityReportsSearchController'); // Adjust the path as necessary


const router=express.Router();
//auth
router.post('/signup',signUpController.postSignup);
router.post('/verificationCode',signUpController.postVerificationCode);
router.post('/login',loginController.postLogin);
router.post('/logout',authenticateToken,logoutController.postLogOut);
router.post('/refreshToken', authController.getRefreshToken);
router.get('/user/myProfile',authenticateToken, userProfile.getProfileInfo);
router.get('/locations',getDBLocations.getLocations);
router.get('/interests',getDBInterests.getInterests);
router.post('/user/myProfile',authenticateToken, userProfile.updateProfileInfo);
router.post('/user/changePassword',authenticateToken, userProfile.changePassword);
router.post('/user/removeInterest',authenticateToken, userProfile.removeInterest);
router.post('/user/addInterest',authenticateToken, userProfile.addInterest);
router.post('/user/deleteAccount',authenticateToken, userProfile.deleteAccount);
router.get('/search/locations/:key', searchLocaions.getLocations);
router.get('/search/interests/:key', searchInterests.getInterests);
router.get('/search/global/:key', globalSearchController.globalSearch);
router.get('/search/educational/:key', educationalSearchController.searchEducationalRes);
router.get('/search/data/:key', dataSearchController.searchData);
router.get('/search/communityreports/:key', communityReportsSearchController.searchCommunityReports);



module.exports=router;