const User = require("../../models/user");
const tempUser = require("../../models/tempUser");
const tempUserInterests = require("../../models/tempUserInterests");
const Interests = require("../../models/interests");
const UserInterests = require("../../models/userInterests");
const { Op } = require('sequelize');
const validator = require('../validator');
const bcrypt = require('bcrypt');
const moment = require('moment');
const nodemailer = require('nodemailer');
const Locatons = require("../../models/location");



exports.postSignup = async (req, res, next) => {
  try {
    console.log(req);
    const { userId, name, email, password, interests, location } = req.body;
    // all values not empty 
    if (!userId) {
      return res.status(409).json({
        message: 'userId is empty',
        body: req.body
      });
    } else if (!name) {
      return res.status(409).json({
        message: 'name is empty',
        body: req.body
      });
    } else if (!email) {
      return res.status(409).json({
        message: 'email is empty',
        body: req.body
      });
    } else if (!password) {
      return res.status(409).json({
        message: 'password is empty',
        body: req.body
      });
    } else if (!interests) {
      return res.status(409).json({
        message: 'interests is empty',
        body: req.body
      });
    } else if (!location) {
      return res.status(409).json({
        message: 'location is empty',
        body: req.body
      });
    }
    // all values are correct
    if (!validator.isUsername(userId) || userId.length < 5 || userId.length > 255) {
      return res.status(409).json({
        message: 'Not Valid userId (length must be: 5-255)',
        body: req.body
      });
    }
    if (!validator.isUsername(name) || name.length < 1 || name.length > 255) {
      return res.status(409).json({
        message: 'Not Valid name (length must be: 1-255)',
        body: req.body
      });
    }
    if (!validator.isEmail(email) || email.length < 5 || email.length > 255) {
      return res.status(409).json({
        message: 'Not Valid email (length must be: 5-255)',
        body: req.body
      });
    }
    if (password.length < 8 || password.length > 255) {
      return res.status(409).json({
        message: 'Not Valid password (length must be: 8-255)',
        body: req.body
      });
    }
    for (let interest of interests) {
      if (interest.length < 1 || interest.length > 255) {
        return res.status(409).json({
          message: interest + 'is Not a Valid interests (length must be: 1-255)',
          body: req.body
        });
      }
    }

    if (location.length < 1 || location.length > 255) {
      return res.status(409).json({
        message: 'Not Valid location (length must be: 1-255)',
        body: req.body
      });
    }
    var locations = await Locatons.findAll();
    var isLocationValid = false;
    for (let dpLocations of locations) {
      if (dpLocations.location == location.toLowerCase().trim()) {
        isLocationValid = true;
      }
    }
    if (!isLocationValid) {
      return res.status(409).json({
        message: 'Not Valid location, call /locations to get all available locations',
        body: req.body
      });
    }
    // find if user exsist in user table
    const existingUserId = await User.findOne({
      where: {
        userId: userId
      },
    });
    const existingEmail = await User.findOne({
      where: {
        email: email
      },
    });
    // find if user exsist in tempuser table
    const existingUserNameInTemp = await tempUser.findOne({
      where: {
        userId: userId
      },
    });
    const existingEmailInTemp = await tempUser.findOne({
      where: {
        email: email
      },
    });
    //if user has a data on temuser will be removed 
    if (existingUserNameInTemp) {
      await existingUserNameInTemp.destroy();
    }
    if (existingEmailInTemp) {
      await existingEmailInTemp.destroy();
    }
    if (existingUserId) {
      // User already exists
      return res.status(409).json({
        message: 'UserId already exists',
        body: req.body
      });
    } if (existingEmail) {
      // mail already exists
      return res.status(409).json({
        message: 'Email already exists',
        body: req.body
      });
    }

    // after all that validation save the new user and send the VerificationCode
    await createUserInTemp(userId, name, email, password, interests, location.toLowerCase().trim());
    return res.status(200).json({
      message: "Please check your Email for the VerificationCode",
      body: req.body
    });


  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      body: req.body
    });
  }
}



async function createUserInTemp(userId, name, email, password, interests, location) {
  var VerificationCode = Math.floor(10000 + Math.random() * 90000);
  //const hashedVerificationCode = await bcrypt.hash(VerificationCode.toString(), 10);
  await sendVerificationCode(email.trim(), VerificationCode);
  const hashedPassword = await bcrypt.hash(password.trim(), 10);// hash the password
  //save the user in temporary table until he verify his account
  const newUser = await tempUser.create({
    userId: userId.trim(),
    name: name.trim(),
    email: email.trim(),
    password: hashedPassword,
    location: location.trim(),
    verificationCode: VerificationCode,
  });
  //save interests in temporary table until user verify his account
  for (let interest of interests) {
    const newTempUserInterest = await tempUserInterests.create({
      interest: interest.toLowerCase().trim(),
      userId: userId,
    });
  }
}
//send VerificationCode to his email 
async function sendVerificationCode(email, code) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'advanced.2001z@gmail.com',
      pass: 'uumi tfky oiuh galb',
    },
  });

  const mailOptions = {
    from: 'advanced.2001z@gmail.com',
    to: email,
    subject: 'EcoTrack Verification Code',
    text: `Your verification code is: ${code} and its valid unless you close the app`,
  };


  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {

    console.error('Error sending email:', error);
    return res.status(500).json({
      message: 'email not found',
      body: req.body
    });
  }

}
//get the VerificationCode
exports.postVerificationCode = async (req, res, next) => {
  try {

    const { verificationCode, email } = req.body;//get data from req
    //find the user by email in tempuser table
    const existingUserInTemp = await tempUser.findOne({
      where: {
        email: email
      }
    });
    //if exists 
    if (existingUserInTemp) {
      const storedVerificationCode = existingUserInTemp.verificationCode;// get the hashed code from the thable
      //compare verificationCode
      if (verificationCode == storedVerificationCode) {
        //move user from temp table to user table
        const newUser = await User.create({
          userId: existingUserInTemp.userId,
          name: existingUserInTemp.name,
          email: existingUserInTemp.email,
          password: existingUserInTemp.password,
          interests: existingUserInTemp.interests,
          location: existingUserInTemp.location,
          score: 0,
        });
        //find temp user interests 
        const existingtempUserInterests = await tempUserInterests.findAll({
          where: {
            userId: existingUserInTemp.userId,
          }
        });

        for (let UserInterest of existingtempUserInterests) {
          //find database existingInterests
          const existingInterests = await Interests.findOne({
            where: {
              interestKeyWord: UserInterest.interest,
            }
          });
          //if Interests already exists increase its counter (how many time it used)
          if (existingInterests) {
            await Interests.update(
              { counter: existingInterests.counter++ },
              {
                where: {
                  interestKeyWord: UserInterest.interest,
                }
              });
          }
          else {
            //create new interest
            var newInterests = await Interests.create({
              interestKeyWord: UserInterest.interest,
              counter: 1,
            });
            //add it to the user
            await UserInterests.create({
              interestId: newInterests.interestId,
              userId: existingUserInTemp.userId,
            });
          }
          //delete the interest from tempUserInterests
          UserInterest.destroy();
        }
        const existingLocation = await Locatons.findOne({
          where: {
            location: existingUserInTemp.location,
          }
        });
        if (existingLocation) {
          await Locatons.update(
            { counter: existingLocation.counter++ },
            {
              where: {
                location: existingUserInTemp.location,
              },
            })
        }

        await existingUserInTemp.destroy();
        return res.status(200).json({
          message: "Your account has been verified successfully, Go to loginPage",
          body: req.body
        });
      }
      else {
        return res.status(409).json({
          message: 'Not Valid code',
          body: req.body
        });
      }


    } else {

      return res.status(409).json({
        message: 'Not Valid email',
        body: req.body
      });
    }




  } catch (err) {
    console.log(err);
    return res.status(409).json({
      message: 'server error',
      body: req.body
    });
  }
}

