const DataCollection = require("../models/dataCollection");
const Location = require("../models/location");

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
    res.status(200).json(dataCollection);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createDataCollection = async (req, res) => {
  const { location, interests, description, date } = req.body;
  const user = req.user;

  userId = user.userId;
  try {
    if (interests.length < 1 || interests.length > 255) {
      return res.status(409).json({
        message: interest + "is Not a Valid interests (length must be: 1-255)",
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
    const newDataCollection = await DataCollection.create({
      userId,
      location,
      interests,
      description,
      date,
    });
    res.status(201).json(newDataCollection);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
};

const updateDataCollection = async (req, res) => {
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

    await dataCollection.update(req.body);
    res.status(200).json(dataCollection);
  } catch (error) {
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
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllDataCollections,
  getDataCollectionById,
  createDataCollection,
  updateDataCollection,
  deleteDataCollection,
};
