const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();
const Data = require("../../models/data"); // Adjust the path as necessary
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

exports.searchData = async (req, res) => {
    try {
        const searchKey = req.params.key; // The string to search for
        const targetLanguage = req.query.lang || 'en'; // Defaulting to English if no language specified

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
            order: [['dataId', 'DESC']],
        });

        if (dbData.length > 0) {
            // Assuming 'DataValue' is the field you want to translate
            const translatedData = await Promise.all(
                dbData.map(async data => {
                    return {
                        ...data.get({ plain: true }),
                        DataValue: await translateText(data.DataValue, targetLanguage),
                    };
                })
            );

            return res.status(200).json({
                message: await translateText('Data Found', targetLanguage),
                data: translatedData,
            });
        } else {
            return res.status(404).json({
                message: await translateText('No Data Found', targetLanguage),
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
