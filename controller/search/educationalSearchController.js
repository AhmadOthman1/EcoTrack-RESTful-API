// Require the necessary model and Sequelize operator
const EducationalRes = require("../../models/educationalRes"); // Adjust path as necessary
const { Op } = require('sequelize');

exports.searchEducationalRes = async (req, res) => {
    try {
        const searchKey = req.params.key; // The string to search for

        // Execute search query on the EducationalRes table
        var dbEducationalRes = await EducationalRes.findAll({
            // Specify the attributes you are interested in
            attributes: ['resId', 'userId', 'date', 'interests', 'location', 'title', 'text', 'image'],
            where: {
                [Op.or]: [
                    { interests: { [Op.like]: '%' + searchKey + '%' } },
                    { location: { [Op.like]: '%' + searchKey + '%' } },
                    { title: { [Op.like]: '%' + searchKey + '%' } },
                    { text: { [Op.like]: '%' + searchKey + '%' } }
                    // Add any other fields you want to search within
                ]
            },
            order: [['resId', 'DESC']], // Adjust ordering if necessary
        });

        // Check if any results were found and respond appropriately
        if (dbEducationalRes.length > 0) {
            return res.status(200).json({
                message: 'Educational Resources Found',
                educationalResources: dbEducationalRes,
            });
        } else {
            return res.status(404).json({
                message: 'No Educational Resources Found',
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
