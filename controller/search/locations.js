const Locatons = require("../../models/location");
const { Op } = require('sequelize'); // Make sure to import Op from Sequelize

exports.getLocations = async (req, res) => {
    try {
        // Assuming params.key is the string you want to search for
        const searchKey = req.params.key; // or you might use req.query.key depending on how you pass the parameter

        var dbLocations = await Locatons.findAll({
            attributes: ['location', 'counter'],
            where: {
                [Op.or]: [
                    { location: { [Op.like]: '%' + searchKey + '%' } },  // Partial match for location
                    { counter: { [Op.like]: '%' + searchKey + '%' } }   // Partial match for counter
                ]
            },
            order: [['counter', 'DESC']],
        });

        if (dbLocations.length > 0)  // Checking if any locations were found
            return res.status(200).json({
                message: 'Our available Locations',
                locations: dbLocations,
            });
        
        return res.status(404).json({
            message: 'Locations not found',
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            body: req.body
        });
    }
}
