const Locatons = require("../models/location");


exports.getLocations = async (req, res) => {
    try {
        var dbLocations = await Locatons.findAll({
            attributes: ['location', 'counter'],
        });
        if (dbLocations)
            return res.status(200).json({
                message: 'Our available Locations',
                locations: dbLocations,
            });
        return res.status(404).json({
            message: 'locations not found',
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            body: req.body
        });
    }
}