const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();
const Interests = require("../../models/interests");
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

exports.getInterests = async (req, res) => {
    try {
        const searchKey = req.params.key; // The string to search for
        const targetLanguage = req.query.lang || 'en'; // Defaulting to English if no language specified

        var dbInterests = await Interests.findAll({
            attributes: ['interestKeyWord', 'counter'],
            where: {
                [Op.or]: [
                    { interestKeyWord: { [Op.like]: '%' + searchKey + '%' } },
                    { counter: { [Op.like]: '%' + searchKey + '%' } }
                ]
            },
            order: [['counter', 'DESC']],
        });

        if (dbInterests.length > 0) {
            // Translate each interest's keyword
            const translatedInterests = await Promise.all(
                dbInterests.map(async interest => {
                    return {
                        ...interest.get({ plain: true }),
                        interestKeyWord: await translateText(interest.interestKeyWord, targetLanguage)
                        // Note: Typically 'counter' might not require translation if it's numeric or specific codes
                    };
                })
            );

            return res.status(200).json({
                message: await translateText('Our available Interests', targetLanguage),
                interests: translatedInterests,
            });
        } else {
            return res.status(404).json({
                message: await translateText('Interests not found', targetLanguage),
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
