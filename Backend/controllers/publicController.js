const User = require('../models/User');
const Resource = require('../models/Resource');

// @desc    Get global statistics for landing page
// @route   GET /api/public/stats
// @access  Public
exports.getGlobalStats = async (req, res) => {
    try {
        // Count organizations (admin role) and individual donors
        const partnersCount = await User.countDocuments({
            role: { $in: ['admin', 'donor'] }
        });

        // Count organizations (admin role) only
        const organizationsCount = await User.countDocuments({
            role: 'admin'
        });

        // Sum up the total quantity of all resources tracked
        const resourcesResult = await Resource.aggregate([
            { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
        ]);
        
        const totalResources = resourcesResult.length > 0 ? resourcesResult[0].totalQuantity : 0;

        res.status(200).json({
            success: true,
            data: {
                partners: partnersCount,
                organizationsCount: organizationsCount,
                resources: totalResources
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get list of all unique verified organizations
// @route   GET /api/public/organizations
// @access  Public
exports.getOrganizations = async (req, res) => {
    try {
        // Find admins that are verified and group by organizationName to ensure uniqueness
        const organizations = await User.aggregate([
            { 
                $match: { 
                    role: 'admin',
                    status: 'verified' 
                } 
            },
            { 
                $group: { 
                    _id: "$organizationName",
                    originalId: { $first: "$_id" }
                } 
            },
            { $sort: { _id: 1 } }
        ]);

        // Format to match the previous structure
        const formattedOrganizations = organizations.map(org => ({
            _id: org.originalId,
            organizationName: org._id
        }));

        res.status(200).json({
            success: true,
            data: formattedOrganizations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
