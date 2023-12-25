// Assuming the file is google_translate_demo.js for translation functions
const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

const EducationalRes = require("../../models/educationalRes"); // Adjust path as necessary
const { Op } = require('sequelize');

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

exports.searchEducationalRes = async (req, res) => {
    try {
        const searchKey = req.params.key; // The string to search for
        const targetLanguage = req.query.lang || 'en'; // Defaulting to English if no language specified

        // Execute search query on the EducationalRes table
        var dbEducationalRes = await EducationalRes.findAll({
            attributes: ['resId', 'userId', 'date', 'interests', 'location', 'title', 'text', 'image'],
            where: {
                [Op.or]: [
                    { interests: { [Op.like]: '%' + searchKey + '%' } },
                    { location: { [Op.like]: '%' + searchKey + '%' } },
                    { title: { [Op.like]: '%' + searchKey + '%' } },
                    { text: { [Op.like]: '%' + searchKey + '%' } }
                ]
            },
            order: [['resId', 'DESC']],
        });

        // Check if any results were found and respond appropriately
        if (dbEducationalRes.length > 0) {
            // Translate result texts
            const translatedResources = await Promise.all(dbEducationalRes.map(async resource => {
                const plainResource = resource.get({ plain: true }); // Convert Sequelize model instance to plain object
                return {
                    ...plainResource,
                    // Translate all specified attributes
                    date: await translateText(plainResource.date, targetLanguage),
                    interests: await translateText(plainResource.interests, targetLanguage),
                    location: await translateText(plainResource.location, targetLanguage),
                    title: await translateText(plainResource.title, targetLanguage),
                    text: await translateText(plainResource.text, targetLanguage),
                    // image attribute is likely a URL or file path, usually not translated
                    // Add or remove fields according to what needs translation
                };
            }));

            return res.status(200).json({
                message: await translateText('Educational Resources Found', targetLanguage),
                educationalResources: translatedResources,
            });
        } else {
            return res.status(404).json({
                message: await translateText('No Educational Resources Found', targetLanguage),
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: await translateText('Internal Server Error', targetLanguage),
            body: req.body
        });
    }
};
