const Interests = require("../../models/interests"); // Adjust the path as necessary
const { Op } = require('sequelize'); // Ensure Op is imported from Sequelize

exports.getInterests = async (req, res) => {
    try {
        // Assuming params.key is the string you want to search for in interests
        const searchKey = req.params.key; // or you might use req.query.key depending on how you pass the parameter

        var dbInterests = await Interests.findAll({
            attributes: ['interestKeyWord', 'counter'],
            where: {
                [Op.or]: [
                    { interestKeyWord: { [Op.like]: '%' + searchKey + '%' } },  // Partial match for interestKeyWord
                    { counter: { [Op.like]: '%' + searchKey + '%' } }          // Partial match for counter
                ]
            },
            order: [['counter', 'DESC']],
        });

        if (dbInterests.length > 0)  // Checking if any interests were found
            return res.status(200).json({
                message: 'Our available Interests',
                interests: dbInterests,
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
