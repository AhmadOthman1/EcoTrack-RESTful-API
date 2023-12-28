const jwt = require('jsonwebtoken');
const User = require("../../models/user");
const CommunityR = require("../../models/communityReporting");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); //where uploaded images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file
  }
});

const upload = multer({ storage: storage }).single('image');

exports.updateReport = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const decoded = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET);
    const userUserId = decoded.userId;

    const existingUser = await User.findOne({
      where: {
        userId: userUserId
      }
    });

    if (existingUser) {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: 'File upload error', error: err.message });
        }

        const reportIdToUpdate = req.params.reportId;
        const updateData = req.body;

        const reportToUpdate = await CommunityR.findOne({
          where: {
            userId: userUserId,
            reportId: reportIdToUpdate
          }
        });

        if (!reportToUpdate) {
          return res.status(404).json({ message: 'Report not found' });
        }

        // Check if a file was uploaded
        if (req.file) {
          const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.filename}`;
          updateData.image = imageUrl;
        }

        await reportToUpdate.update(updateData);

        return res.status(200).json({
          message: 'Report updated successfully',
          updatedReport: reportToUpdate
        });
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Server Error',
      error: err.message
    });
  }
};
