const express = require("express");
const signUpController = require("../controller/userProfileController/signUp");
const loginController = require("../controller/userProfileController/logIn");
const logoutController = require("../controller/userProfileController/logOut");
const { authenticateToken } = require("../controller/authController");
const authController = require("../controller/authController");
const userProfile = require("../controller/userProfileController/profileInfo");
const getDBLocations = require("../controller/getLocations");
const getDBInterests = require("../controller/getInterests");
const locationsController = require("../controller/search/locationsController"); // Adjust the path as necessary
const searchInterests = require("../controller/search/interests");
const globalSearchController = require("../controller/search/globalSearch");
const educationalSearchController = require("../controller/search/educationalSearchController");
const dataSearchController = require("../controller/search/dataSearchController"); // Adjust the path as necessary
const communityReportsSearchController = require("../controller/search/communityReportsSearchController"); // Adjust the path as necessary
const alertController = require("../controller/userProfileController/getAlertController"); // Adjust the path as necessary
const dataController = require("../controller/userProfileController/getDataCollection"); // Adjust the path as necessary
const getReports = require("../controller/comReportController/getReport");
const createReports = require("../controller/comReportController/createReports");
const updateReport = require("../controller/comReportController/updateReport");
const deleteReport = require("../controller/comReportController/deleteReport");
const getResources = require("../controller/eduResController/getResource");
const createResources = require("../controller/eduResController/createResource");
const updateResource = require("../controller/eduResController/updateResource");
const deleteResource = require("../controller/eduResController/deleteResource");
// const getImage = require('../uploads'); // Commented out as it was part of the removed code

const dataCollections = require("../controller/dataCollectionController");

const router = express.Router();

// Authentication Routes
router.post("/signup", signUpController.postSignup);
router.post("/verificationCode", signUpController.postVerificationCode);
router.post("/login", loginController.postLogin);
router.post("/logout", authenticateToken, logoutController.postLogOut);
router.post("/refreshToken", authController.getRefreshToken);

// User Profile Routes
router.get("/user/myProfile", authenticateToken, userProfile.getProfileInfo);
router.put(
  "/user/myProfile",
  authenticateToken,
  userProfile.updateProfileInfo
);
router.post(
  "/user/changePassword",
  authenticateToken,
  userProfile.changePassword
);
router.delete(
  "/user/Interests",
  authenticateToken,
  userProfile.removeInterest
);
router.post("/user/Interests", authenticateToken, userProfile.addInterest);
router.delete(
  "/user/myProfile",
  authenticateToken,
  userProfile.deleteAccount
);

// Data Collections Routes
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

// Search Routes
router.get("/search/locations/:key", locationsController.getLocations);
router.get("/search/interests/:key", searchInterests.getInterests);
router.get("/search/global/:key", globalSearchController.globalSearch);
router.get(
  "/search/educational/:key",
  educationalSearchController.searchEducationalRes
);
router.get("/search/data/:key", dataSearchController.searchData);
router.get(
  "/search/communityreports/:key",
  communityReportsSearchController.searchCommunityReports
);

// User Alerts and Data Routes
router.get("/user/alerts", authenticateToken, alertController.getUserAlerts);
router.get("/user/data", authenticateToken, dataController.getDataCollection);

// Community Reports Routes
router.get(
  "/communityReports/getMyReports",
  authenticateToken,
  getReports.getMyReports
);
router.post(
  "/communityReports/createReport",
  authenticateToken,
  createReports.createNewReport
);
router.put(
  "/communityReports/updateReport/:reportId",
  authenticateToken,
  updateReport.updateReport
);
router.delete(
  "/communityReports/deleteReport/:reportId",
  authenticateToken,
  deleteReport.deleteReport
);

// Educational Resources Routes
router.get(
  "/educationalResources/getMyResourses",
  authenticateToken,
  getResources.getMyResources
);
router.post(
  "/educationalResources/createResource",
  authenticateToken,
  createResources.createNewResource
);
router.put(
  "/educationalResources/updateResource/:resId",
  authenticateToken,
  updateResource.updateResource
);
router.delete(
  "/educationalResources/deleteResource/:resId",
  authenticateToken,
  deleteResource.deleteResource
);

// router.get('/uploads', getImage);

module.exports = router;
