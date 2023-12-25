
// globalSearchController.js
const EducationalRes = require("../../models/educationalRes"); // Adjust path as necessary
const Data = require("../../models/data"); // Adjust path as necessary
const CommunityReporting = require("../../models/communityReporting"); // Adjust path as necessary
const { Op } = require('sequelize');
const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

// Setup translation client
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

// Translation function
const translateText = async (text, targetLanguage) => {
    try {
        let [translation] = await translate.translate(text, targetLanguage);
        return translation;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return text; // Return the original text if translation fails
    }
};

exports.globalSearch = async (req, res) => {
    try {
        const searchKey = req.params.key; // The string to search for
        const targetLanguage = req.query.lang || 'en'; // Defaulting to English if no language specified

        // Execute all searches in parallel for performance
        const [educationalResults, dataResults, communityReportResults] = await Promise.all([
            // Search and translate results in Educational Resources
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
            }).then(results =>
                Promise.all(results.map(async result => ({
                    ...result.get({ plain: true }),
                    title: await translateText(result.title, targetLanguage),
                    text: await translateText(result.text, targetLanguage),
                    location: await translateText(result.location, targetLanguage),
                    interests: await translateText(result.interests, targetLanguage)


                    // Add other fields as necessary
                })))
            ),
            // Search and translate results in Data
            Data.findAll({
                attributes: ['dataCollectionId', 'dateType', 'DataValue'],
                where: {
                    [Op.or]: [
                        { dataCollectionId: { [Op.like]: '%' + searchKey + '%' } },
                        { dateType: { [Op.like]: '%' + searchKey + '%' } },
                        { DataValue: { [Op.like]: '%' + searchKey + '%' } }
                    ]
                }
            }).then(results =>
                Promise.all(results.map(async result => ({
                    ...result.get({ plain: true }),
                    DataValue: await translateText(result.DataValue, targetLanguage)
                    // Add other fields as necessary
                })))
            ),
            // Search and translate results in Community Reporting
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
            }).then(results =>
                Promise.all(results.map(async result => ({
                    ...result.get({ plain: true }),
                    title: await translateText(result.title, targetLanguage),
                    text: await translateText(result.text, targetLanguage),
                    location: await translateText(result.location, targetLanguage),
                    interests: await translateText(result.interests, targetLanguage)
                    // Add other fields as necessary
                })))
            )
        ]);

        // Combine and prepare final results
        const combinedResults = {
            educationalResources: educationalResults,
            data: dataResults,
            communityReports: communityReportResults
        };

        // Prepare message based on search results
        let message = Object.values(combinedResults).some(results => results.length > 0) ?
                      'Results found across tables' :
                      'No results found across tables';

        // Send translated response
        return res.status(200).json({
            message: await translateText(message, targetLanguage),
            combinedResults: combinedResults
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: await translateText('Internal Server Error', targetLanguage),
            body: req.body
        });
    }
};
