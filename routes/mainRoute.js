const express = require("express");
const signUpController = require("../controller/userProfileController/signUp");
const loginController = require("../controller/userProfileController/logIn");
const logoutController = require("../controller/userProfileController/logOut");
const { authenticateToken } = require("../controller/authController");
const authController = require("../controller/authController");
const userProfile = require("../controller/userProfileController/profileInfo");
const getDBLocations = require("../controller/getLocations");
const getDBInterests = require("../controller/getInterests");

const dataCollections = require("../controller/dataCollectionController");

const router = express.Router();
//auth
router.post("/signup", signUpController.postSignup);
router.post("/verificationCode", signUpController.postVerificationCode);
router.post("/login", loginController.postLogin);
router.post("/logout", authenticateToken, logoutController.postLogOut);
router.post("/refreshToken", authController.getRefreshToken);
router.get("/user/myProfile", authenticateToken, userProfile.getProfileInfo);
router.get("/locations", getDBLocations.getLocations);
router.get("/interests", getDBInterests.getInterests);
router.post(
  "/user/myProfile",
  authenticateToken,
  userProfile.updateProfileInfo
);
router.post(
  "/user/changePassword",
  authenticateToken,
  userProfile.changePassword
);
router.post(
  "/user/removeInterest",
  authenticateToken,
  userProfile.removeInterest
);
router.post("/user/addInterest", authenticateToken, userProfile.addInterest);
router.post(
  "/user/deleteAccount",
  authenticateToken,
  userProfile.deleteAccount
);

router.get(
  "/data_collections",
  authenticateToken,
  dataCollections.getAllDataCollections
);
router.get(
  "/data_collections/:id",
  authenticateToken,
  dataCollections.getDataCollectionById
);
router.post(
  "/data_collections",
  authenticateToken,
  dataCollections.createDataCollection
);
router.put(
  "/data_collections/:id",
  authenticateToken,
  dataCollections.updateDataCollection
);
router.delete(
  "/data_collections/:id",
  authenticateToken,
  dataCollections.deleteDataCollection
);

module.exports = router;

