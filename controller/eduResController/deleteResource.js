const jwt = require('jsonwebtoken');
const User = require("../../models/user");
const educationalR = require("../../models/educationalRes");


exports.deleteResource = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const decoded = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET);
        const userUserId = decoded.userId;

        const existingUser = await User.findOne({
            where: {
                userId: userUserId
            }
        });

        if (existingUser) {
            const resourceIdToDelete = req.params.resId;

            const resourceToDelete = await educationalR.findOne({
                where: {
                    userId: userUserId,
                    resId: resourceIdToDelete
                }
            });

            if (!resourceToDelete) {
                return res.status(404).json({ message: 'Resource not found' });
            }

            await resourceToDelete.destroy();

            // Decrement score, ensuring it doesn't go below zero
            if (existingUser.score > 0) {
                existingUser.score = existingUser.score - 1;
            } 
            else {
                existingUser.score = 0; 
            }
  
  await existingUser.save();

            return res.status(200).json({ message: 'Resource deleted successfully, but you lost a point' });
        } 
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    } 
    
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Server Error',
            error: err.message
        });
    }
};
