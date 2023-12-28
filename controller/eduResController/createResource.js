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

exports.createNewResource = async (req, res) => {
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

        const { date, interests, location, title, text } = req.body;

        if (!req.file) {
          return res.status(400).json({ message: 'Please upload an image file' });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.filename}`;
        
        const newResource = await educationalR.create({
          userId: existingUser.userId,
          date,
          interests,
          location,
          title,
          text,
          image: imageUrl
        });

        // Increment score
        existingUser.score = existingUser.score + 1;
        await existingUser.save();

        return res.status(200).json({
          message: 'You just gained a new score!',
          resource: newResource
        });
      });
    }

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Server Error',
      error: err.message
    });
  }
};