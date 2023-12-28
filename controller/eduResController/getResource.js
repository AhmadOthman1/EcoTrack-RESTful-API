const jwt = require('jsonwebtoken');
const User = require("../../models/user");
const educationalR = require("../../models/educationalRes");


exports.getMyResources = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const decoded = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET);
        const userUserId = decoded.userId;
        const existingUser = await User.findOne({
            where: {
                userId: userUserId
            }
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resources = await educationalR.findAll({
            where: {
                userId: userUserId,
            }
        });

        if (!resources || resources.length === 0) {
            return res.status(404).json({ message: 'No community resources found' });
        }

        const detailedResources = resources.map(resource => ({
            resId: resource.resId,
            userId: resource.userId,
            date: resource.date,
            interest: resource.interest,
            location: resource.location,
            title: resource.title,
            text: resource.text,
            image: resource.image,
        }));

        return res.status(200).json({
            message: 'Your educational resources :',
            resources: detailedResources 
        });

    }
     catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Server Error',
            error: err.message
        });
    }
};
