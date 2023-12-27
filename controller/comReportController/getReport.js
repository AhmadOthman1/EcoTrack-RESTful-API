const jwt = require('jsonwebtoken');
const User = require("../../models/user");
const CommunityR = require("../../models/communityReporting");

exports.getMyReports = async (req, res) => {
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

        const reports = await CommunityR.findAll({
            where: {
                userId: userUserId,
            }
        });

        if (!reports || reports.length === 0) {
            return res.status(404).json({ message: 'No community reports found' });
        }

        const detailedReports = reports.map(report => ({
            reportId: report.reportId,
            userId: report.userId,
            date: report.date,
            interest: report.interest,
            location: report.location,
            title: report.title,
            text: report.text,
            image: report.image,
        }));

        return res.status(200).json({
            message: 'Your community reports :',
            reports: detailedReports 
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
