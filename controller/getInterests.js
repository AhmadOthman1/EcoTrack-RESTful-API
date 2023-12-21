const Interests = require("../models/interests");


exports.getInterests = async (req, res) => {
    try {
        var dbInterests = await Interests.findAll({
            attributes: ['interestKeyWord', 'counter'],
            order: [['counter', 'DESC']],
        });
        if (dbInterests)
            return res.status(200).json({
                message: 'Our available Interests',
                Interests: dbInterests,
            });
        return res.status(404).json({
            message: 'Interests not found',
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            body: req.body
        });
    }
}