const DataCollection = require("../models/dataCollection");

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
  console.log(user + "inside datacollection");
  userId = user.userId;
  try {
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
