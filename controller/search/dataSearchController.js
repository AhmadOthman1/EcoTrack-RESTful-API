// Require the necessary model and Sequelize operator
const Data = require("../../models/data"); // Adjust path as necessary
const { Op } = require('sequelize');

exports.searchData = async (req, res) => {
    try {
        const searchKey = req.params.key; // The string to search for

        // Execute search query on the Data table
        var dbData = await Data.findAll({
            attributes: ['dataId', 'dataCollectionId', 'dateType', 'DataValue'],
            where: {
                [Op.or]: [
                    { dataId: { [Op.like]: '%' + searchKey + '%' } }, // Though it's uncommon to search by ID like this
                    { dataCollectionId: { [Op.like]: '%' + searchKey + '%' } },  // Similarly unusual for IDs
                    { dateType: { [Op.like]: '%' + searchKey + '%' } },  // More common for text-based fields
                    { DataValue: { [Op.like]: '%' + searchKey + '%' } }  // Text-based field
                    // Add any other fields you want to search within
                ]
            },
            order: [['dataId', 'DESC']], // Adjust ordering if necessary
        });

        // Check if any results were found and respond appropriately
        if (dbData.length > 0) {
            return res.status(200).json({
                message: 'Data Found',
                data: dbData,
            });
        } else {
            return res.status(404).json({
                message: 'No Data Found',
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            body: req.body
        });
    }
}
