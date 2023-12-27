// Require the necessary model and Sequelize operator
const CommunityReporting = require("../../models/communityReporting"); // Adjust path as necessary
const { Op } = require('sequelize');

exports.searchCommunityReports = async (req, res) => {
    try {
        const searchKey = req.params.key; // The string to search for

        // Execute search query on the CommunityReporting table
        var dbCommunityReports = await CommunityReporting.findAll({
            attributes: ['reportId', 'userId', 'date', 'interests', 'location', 'title', 'text', 'image'],
            where: {
                [Op.or]: [
                    { interests: { [Op.like]: '%' + searchKey + '%' } },
                    { location: { [Op.like]: '%' + searchKey + '%' } },
                    { title: { [Op.like]: '%' + searchKey + '%' } },
                    { text: { [Op.like]: '%' + searchKey + '%' } }
                    // Add any other fields you want to search within
                ]
            },
            order: [['reportId', 'DESC']], // Adjust ordering if necessary
        });

        // Check if any results were found and respond appropriately
        if (dbCommunityReports.length > 0) {
            return res.status(200).json({
                message: 'Community Reports Found',
                reports: dbCommunityReports,
            });
        } else {
            return res.status(404).json({
                message: 'No Community Reports Found',
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
