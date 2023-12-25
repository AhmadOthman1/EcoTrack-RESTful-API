// globalSearchController.js
const Locations = require("../../models/location");
const Interests = require("../../models/interests");
const EducationalRes = require("../../models/educationalRes"); // Adjust path as necessary
const Data = require("../../models/data"); // Adjust path as necessary
const CommunityReporting = require("../../models/communityReporting"); // Adjust path as necessary
const { Op } = require('sequelize');

exports.globalSearch = async (req, res) => {
    try {
        const searchKey = req.params.key; // The string to search for

        // Execute all searches in parallel for performance
        const [locationResults, interestResults, educationalResults, dataResults, communityReportResults] = await Promise.all([
            // Search in Locations
            Locations.findAll({
                attributes: ['location', 'counter'],
                where: {
                    [Op.or]: [
                        { location: { [Op.like]: '%' + searchKey + '%' } },
                        { counter: { [Op.like]: '%' + searchKey + '%' } }
                    ]
                },
                order: [['counter', 'DESC']],
            }),
            // Search in Interests
            Interests.findAll({
                attributes: ['interestKeyWord', 'counter'],
                where: {
                    [Op.or]: [
                        { interestKeyWord: { [Op.like]: '%' + searchKey + '%' } },
                        { counter: { [Op.like]: '%' + searchKey + '%' } }
                    ]
                },
                order: [['counter', 'DESC']],
            }),
            // Search in Educational Resources
            EducationalRes.findAll({
                attributes: ['date', 'interests', 'location', 'title', 'text', 'image'],
                where: {
                    [Op.or]: [
                        { date: { [Op.like]: '%' + searchKey + '%' } },
                        { interests: { [Op.like]: '%' + searchKey + '%' } },
                        { location: { [Op.like]: '%' + searchKey + '%' } },
                        { title: { [Op.like]: '%' + searchKey + '%' } },
                        { text: { [Op.like]: '%' + searchKey + '%' } }
                    ]
                }
            }),
            // Search in Data
            Data.findAll({
                attributes: ['dataCollectionId', 'dateType', 'DataValue'],
                where: {
                    [Op.or]: [
                        { dataCollectionId: { [Op.like]: '%' + searchKey + '%' } },
                        { dateType: { [Op.like]: '%' + searchKey + '%' } },
                        { DataValue: { [Op.like]: '%' + searchKey + '%' } }
                    ]
                }
            }),
            // Search in Community Reporting
            CommunityReporting.findAll({
                attributes: ['userId', 'date', 'interests', 'location', 'title', 'text', 'image'],
                where: {
                    [Op.or]: [
                        { userId: { [Op.like]: '%' + searchKey + '%' } },
                        { date: { [Op.like]: '%' + searchKey + '%' } },
                        { interests: { [Op.like]: '%' + searchKey + '%' } },
                        { location: { [Op.like]: '%' + searchKey + '%' } },
                        { title: { [Op.like]: '%' + searchKey + '%' } },
                        { text: { [Op.like]: '%' + searchKey + '%' } }
                    ]
                }
            })
        ]);

        // Combine results
        const combinedResults = {
            locations: locationResults,
            interests: interestResults,
            educationalResources: educationalResults,
            data: dataResults,
            communityReports: communityReportResults
        };

        // Check if any results were found
        if (Object.values(combinedResults).some(results => results.length > 0)) {
            return res.status(200).json({
                message: 'Results found across tables',
                combinedResults
            });
        } else {
            return res.status(404).json({
                message: 'No results found across tables'
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
