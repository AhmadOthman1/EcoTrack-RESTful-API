const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const DataCollection = require("../models/dataCollection");
const Location = require("../models/location");
const User = require("../models/user");
const Alert = require("../models/Alert");
const Interests = require("../models/interests");
const UserInterests = require("../models/userInterests");
const Data = require("../models/data");
const nodemailer = require("nodemailer");

const ensureDataCollectionModifier = (dataCollection, userId) => {
  return dataCollection.userId === userId;
};

const getAllDataCollections = async (req, res) => {
  try {
    const dataCollections = await DataCollection.findAll();
    res.status(200).json(dataCollections);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDataCollectionById = async (req, res) => {
  const { id } = req.params;
  try {
    const dataCollection = await DataCollection.findByPk(id);
    if (!dataCollection) {
      return res.status(404).json({ error: "Data collection not found" });
    }
    const populatedDataCollection = await DataCollection.findByPk(id, {
      include: [{ model: Data }],
    });

    res.status(201).json(populatedDataCollection);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createDataCollection = async (req, res) => {
  const { location, interests, dataArray, description, date } = req.body;
  const interstsArray = interests;
  const user = req.user;

  userId = user.userId;
  try {
    if (interests.length < 1 || interests.length > 511) {
      return res.status(409).json({
        message: interest + "is Not a Valid interests (length must be: 1-511)",
        body: req.body,
      });
    }
    if (description.length < 1 || description.length > 1023) {
      return res.status(409).json({
        message:
          interest + "is Not a Valid description (length must be: 1-1023)",
        body: req.body,
      });
    }
    if (location.length < 1 || location.length > 255) {
      return res.status(409).json({
        message: "Not Valid location (length must be: 1-255)",
        body: req.body,
      });
    }
    var locationFromDb = await Location.findByPk(location);

    if (!locationFromDb) {
      return res.status(409).json({
        message:
          "Not Valid location, call /locations to get all available locations",
        body: req.body,
      });
    }
    if (
      !Array.isArray(dataArray) &&
      dataArray.length < 1 &&
      dataArray.length > 63
    ) {
      return res.status(409).json({
        message: "interests should be array, and contains 1-63 data ",
        body: req.body,
      });
    }

    for (let i = 0; i < dataArray.length; i++) {
      if (!ValidateDataSingle(dataArray[i]))
        return res.status(409).json({
          message: `your data at position ${i + 1} is not valid`,
          body: req.body,
        });
    }

    const newDataCollection = await DataCollection.create({
      userId,
      location,
      interests: interstsArray.join(","),
      description,
      date,
    });

    let dataStorePromises = [];
    for (let dataSingle of dataArray) {
      let prom = Data.create({
        dateType: dataSingle.dateType,
        DataValue: dataSingle.DataValue,
        dataCollectionId: newDataCollection.dataCollectionId,
      });

      dataStorePromises.push(prom);
    }

    await Promise.all(dataStorePromises);
    const userFromDb = await User.findByPk(userId);
    await userFromDb.increment("score", { by: 1 });

    notifyIntersted(newDataCollection, interstsArray);
    const populatedDataCollection = await DataCollection.findByPk(
      newDataCollection.dataCollectionId,
      {
        include: [{ model: Data }],
      }
    );

    res.status(201).json(populatedDataCollection);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
};

const updateDataCollection = async (req, res) => {
  const { location, interests, dataArray, description, date } = req.body;

  const { id } = req.params;
  try {
    const dataCollection = await DataCollection.findByPk(id);
    if (!dataCollection) {
      return res.status(404).json({ error: "Data collection not found" });
    }
    if (!ensureDataCollectionModifier(dataCollection, req.user.userId)) {
      console.log(
        ensureDataCollectionModifier(dataCollection, req.user.userId)
      );
      return res
        .status(403)
        .json({ error: "You aren't the creator of the collection" });
    }
    req.body.interests = req.body.interests.join(",");

    if (interests.length < 1 || interests.length > 255) {
      return res.status(409).json({
        message: interest + "is Not a Valid interests (length must be: 1-255)",
        body: req.body,
      });
    }
    if (location.length < 1 || location.length > 255) {
      return res.status(409).json({
        message: "Not Valid location (length must be: 1-255)",
        body: req.body,
      });
    }
    var locationFromDb = await Location.findByPk(location);

    if (!locationFromDb) {
      return res.status(409).json({
        message:
          "Not Valid location, call /locations to get all available locations",
        body: req.body,
      });
    }
    if (description.length < 1 || description.length > 1023) {
      return res.status(409).json({
        message:
          interest + "is Not a Valid description (length must be: 1-1023)",
        body: req.body,
      });
    }

    if (
      !Array.isArray(dataArray) &&
      dataArray.length < 1 &&
      dataArray.length > 63
    ) {
      return res.status(409).json({
        message: "interests should be array, and contains 1-63 data ",
        body: req.body,
      });
    }

    for (let i = 0; i < dataArray.length; i++) {
      if (!ValidateDataSingle(dataArray[i]))
        return res.status(409).json({
          message: `your data at position ${i + 1} is not valid`,
          body: req.body,
        });
    }

    const dataToDelete = await Data.findAll({
      where: {
        dataCollectionId: id,
      },
    });

    if (dataToDelete.length > 0) {
      const deletePromises = dataToDelete.map((data) => {
        return data.destroy();
      });

      await Promise.all(deletePromises);
    }

    await dataCollection.update(req.body);

    let dataStorePromises = [];
    for (let dataSingle of dataArray) {
      let prom = Data.create({
        dateType: dataSingle.dateType,
        DataValue: dataSingle.DataValue,
        dataCollectionId: id,
      });

      dataStorePromises.push(prom);
    }

    await Promise.all(dataStorePromises);
    const populatedDataCollection = await DataCollection.findByPk(id, {
      include: [{ model: Data }],
    });

    res.status(201).json(populatedDataCollection);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteDataCollection = async (req, res) => {
  const { id } = req.params;
  try {
    const dataCollection = await DataCollection.findByPk(id);
    if (!dataCollection) {
      return res.status(404).json({ error: "Data collection not found" });
    }
    if (!ensureDataCollectionModifier(dataCollection, req.user.userId)) {
      return res
        .status(403)
        .json({ error: "You aren't the creator of the collection" });
    }
    await dataCollection.destroy();
    const userFromDb = await User.findByPk(userId);
    await userFromDb.increment("score", { by: -1 });

    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const notifyIntersted = async (dataCollection, interestsArray) => {
  for (interest of interestsArray) {
    const users = await findUsersByInterest(interest);
    users.forEach(async (user) => {
      notifySingleIntersted(user, dataCollection);
      console.log("user notified");
    });
  }
};
const notifySingleIntersted = async (user, dataCollection) => {
  const alerter = Alert.create({
    dataCollectionId: dataCollection.dataCollectionId,
    userId: user.userId,
  });
  const mailer = sendEmailForInterestNotify(
    user.email,
    dataCollection,
    interest
  );
  Promise.all([alerter, mailer]);
};

async function findUsersByInterest(interestKeyword) {
  try {
    const interest = await Interests.findOne({
      where: {
        interestKeyWord: {
          [Op.like]: `%${interestKeyword}%`,
        },
      },
    });

    if (!interest) {
      console.log(`No interest found with keyword: ${interestKeyword}`);
      return [];
    }

    const usersWithInterest = await UserInterests.findAll({
      where: {
        interestId: interest.interestId,
      },
    });
    const userIds = usersWithInterest.map(
      (userInterest) => userInterest.userId
    );
    const users = await User.findAll({
      where: {
        userId: {
          [Op.in]: userIds,
        },
      },
    });

    return users;
  } catch (error) {
    console.error("Error finding users by interest:", error);
    throw error;
  }
}

const sendEmailForInterestNotify = async (
  destEmail,
  dataCollection,
  interest
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "advanced.2001z@gmail.com",
      pass: "swid eimv ekdn jekj",
    },
  });

  const mailOptions = {
    from: "advanced.2001z@gmail.com",
    to: destEmail,
    subject: "EcoTrack Updates!!",
    text: `There's updates related to your interst: ${interest} and its descriped by ${dataCollection.description}`,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
  } catch {}
};

const ValidateDataSingle = (dataSingle) => {
  console.log(dataSingle);
  if (dataSingle.dateType.length < 2 && dataSingle.dateType.length > 255)
    return false;
  if (dataSingle.DataValue.length < 1 && dataSingle.DataValue.length > 255)
    return false;

  return true;
};
module.exports = {
  getAllDataCollections,
  getDataCollectionById,
  createDataCollection,
  updateDataCollection,
  deleteDataCollection,
};
