const express=require('express');
const signUpController=require('../controller/userProfileController/signUp')
const loginController=require('../controller/userProfileController/logIn')
const logoutController=require('../controller/userProfileController/logOut')
const { authenticateToken } = require('../controller/authController');
const authController=require('../controller/authController')
const userProfile=require('../controller/userProfileController/profileInfo')
const getDBLocations=require('../controller/getLocations')
const getDBInterests=require('../controller/getInterests')

const getReports=require('../controller/comReportController/getReport')
const createReports=require('../controller/comReportController/createReports')
const updateReport=require('../controller/comReportController/updateReport')
const deleteReport=require('../controller/comReportController/deleteReport')

const getResources=require('../controller/eduResController/getResource')
const createResources=require('../controller/eduResController/createResource')
const updateResource=require('../controller/eduResController/updateResource')
const deleteResource=require('../controller/eduResController/deleteResource')

// const getImage=require('../uploads')


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

router.get('/communityReports/getMyReports',authenticateToken, getReports.getMyReports);
router.post('/communityReports/createReport',authenticateToken, createReports.createNewReport);
router.put('/communityReports/updateReport/:reportId',authenticateToken, updateReport.updateReport);
router.delete('/communityReports/deleteReport/:reportId',authenticateToken, deleteReport.deleteReport);

router.get('/educationalResources/getMyResourses',authenticateToken, getResources.getMyResources);
router.post('/educationalResources/createResource',authenticateToken, createResources.createNewResource);
router.put('/educationalResources/updateResource/:resId',authenticateToken, updateResource.updateResource);
router.delete('/educationalResources/deleteResource/:resId',authenticateToken, deleteResource.deleteResource);

// router.get('/uploads', getImage);


module.exports=router;