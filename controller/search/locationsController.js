const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();
const Locations = require("../../models/location");
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

exports.getLocations = async (req, res) => {
    try {
        const searchKey = req.params.key; // The string to search for
        const targetLanguage = req.query.lang || 'en'; // Defaulting to English if no language specified

        var dbLocations = await Locations.findAll({
            attributes: ['location', 'counter'],
            where: {
                [Op.or]: [
                    { location: { [Op.like]: '%' + searchKey + '%' } },
                    { counter: { [Op.like]: '%' + searchKey + '%' } }
                ]
            },
            order: [['counter', 'DESC']],
        });

        if (dbLocations.length > 0) {
            // Translate result texts if necessary
            const translatedLocations = await Promise.all(
                dbLocations.map(async location => {
                    return {
                        ...location.get({ plain: true }),
                        location: await translateText(location.location, targetLanguage)
                        // Note: Typically 'counter' might not require translation
                    };
                })
            );

            return res.status(200).json({
                message: await translateText('Our available Locations', targetLanguage),
                locations: translatedLocations,
            });
        } else {
            return res.status(404).json({
                message: await translateText('Locations not found', targetLanguage),
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
