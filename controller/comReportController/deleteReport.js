const jwt = require('jsonwebtoken');
const User = require("../../models/user");
const CommunityR = require("../../models/communityReporting");

exports.deleteReport = async (req, res) => {
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
            const reportIdToDelete = req.params.reportId;

            const reportToDelete = await CommunityR.findOne({
                where: {
                    userId: userUserId,
                    reportId: reportIdToDelete
                }
            });

            if (!reportToDelete) {
                return res.status(404).json({ message: 'Report not found' });
            }

            await reportToDelete.destroy();

            // decrement score
            existingUser.score = existingUser.score - 1;
            await existingUser.save();

            return res.status(200).json({ message: 'Report deleted successfully, but you lost a point' });
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
