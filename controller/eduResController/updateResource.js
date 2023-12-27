const jwt = require('jsonwebtoken');
const User = require("../../models/user");
const educationalR = require("../../models/educationalRes");
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

exports.updateResource = async (req, res) => {
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

        const resourceIdToUpdate = req.params.resId;
        const updateData = req.body;

        const resourceToUpdate = await educationalR.findOne({
          where: {
            userId: userUserId,
            resId: resourceIdToUpdate
          }
        });

        if (!resourceToUpdate) {
          return res.status(404).json({ message: 'Resource not found' });
        }

        if (req.file) {
          const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.filename}`;
          updateData.image = imageUrl; 
        }

        await resourceToUpdate.update(updateData);

        return res.status(200).json({
          message: 'Resource updated successfully',
          updatedResource: resourceToUpdate
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
