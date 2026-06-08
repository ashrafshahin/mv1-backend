const User = require('../models/userSchema');

// Vendors
exports.getPendingVendorsController = async (req, res) => {
    try {
        const vendors = await User.find({
            role: 'vendor',
            status: 'pending'
        }).select('name email shopName shopAddress nidNumber createAt'); // selective data required

        res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors,
        });
    } catch (error) {
        console.log(error, 'Vendor Pending Error...');
        return res.status(500).json({
            success: false,
            message: 'Server Error  Vendor pending...'
        })
    }
};

exports.getAllVendorsController = async (req, res) => {
    try {
        const vendors = await User.find({
            role: 'vendor',
            status: 'pending'
        }).select('name email shopName status shopAddress nidNumber createAt rejectReason approvedAt'); // selective data required

        res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors,
        });
    } catch (error) {
        console.log(error, 'All Vendor get Error...');
        return res.status(500).json({
            success: false,
            message: 'Server Error all Vendors get ...'
        })
    }
};

exports.getAllApprovedVendorController = async (req, res) => {
    try {
        const vendors = await User.find({
            role: 'vendor',
            status: 'approved'
        }).select('name email shopName shopAddress nidNumber createAt approvedAt ');

        res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors,
        });
    } catch (error) {
        console.log(error, 'get All Approved Vendor Error...');
        return res.status(500).json({
            success: false,
            message: 'Server Error  get all Vendor approved ...'
        })
    }
};

exports.getAllRejectedVendorController = async (req, res) => {
    try {
        const vendors = await User.find({
            role: 'vendor',
            status: 'approved'
        }).select('name email shopName shopAddress nidNumber rejectReason createAt ');

        res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors,
        });
    } catch (error) {
        console.log(error, 'get All Rejected Vendor Error...');
        return res.status(500).json({
            success: false,
            message: 'Server Error  getAllRejectedVendor...'
        })
    }
};

exports.getSuspendedVendorsController = async (req, res) => {
    try {
        const vendors = await User.find({
            role: 'vendor',
            status: 'suspended'
        }).select('name email shopName shopAddress nidNumber suspendReason suspendedAt createAt');

        res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors,
        });
    } catch (error) {
        console.log(error, 'Get Suspended vendors Error...');
        return res.status(500).json({
            success: false,
            message: 'Server Error Get Suspended Vendor pending...'
        })
    }
};


exports.approveVendorController = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await User.findById(id).select('-password');
        if (!vendor || vendor.role !== 'vendor') {
            return res.status(404).json({ success: false, message: 'vendor not found...' })
        };

        if (vendor.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Vendor cannot be approved from ${vendor.status} status`
            });
        }

        vendor.status = 'approved';
        vendor.approvedAt = new Date();
        await vendor.save();

        // todo: send approval email

        return res.status(200).json({
            success: true,
            message: 'Vendor Approved successfully...',
            data: vendor,
        })

    } catch (error) {
        console.log(error, 'Vendor Approval Error...');
        return res.status(500).json({
            success: false,
            message: 'Server Error during Vendor Approval...'
        })
    }
};

// this is one way we can do reject/suspend work...
exports.rejectVendorController = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        if (!reason) {
            return res.status(400).json({ success: false, message: 'Rejection reason is required...' });
        };
        const vendor = await User.findOneAndUpdate(
            { _id: id, role: 'vendor', status: 'pending' },
            { status: 'rejected', rejectReason: reason, rejectedAt: new Date() },
            { new: true },

        ).select('name email shopName status rejectReason');

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found or cannot be rejected in current state...'
            });
        };

        //todo: send email for rejection ....

        return res.status(200).json({
            success: true,
            message: 'Vendor rejected successfully...',
            data: vendor,
        });

    } catch (error) {
        console.log(error, 'Vendor Reject Error...');
        return res.status(500).json({
            success: false,
            message: 'Server Error during Vendor rejection work...'
        });
    };
};

// this is another way we can do reject/suspend work...
exports.suspendVendorController = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const vendor = await User.findById(id).select('-password');
        if (!vendor || vendor.role !== 'vendor') {
            return res.status(404).json({ success: false, message: 'vendor not found...' })
        };

        if (vendor.status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Only Active Vendors can be suspended...',
            });
        }

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Suspension reason is required'
            });
        }

        vendor.status = 'suspended';
        vendor.suspendReason = reason;
        vendor.suspendedAt = new Date();
        await vendor.save();

        //todo: send email for suspention ....


        return res.status(200).json({
            success: true,
            message: 'Vendor suspended successfully...',
            data: vendor,
        });

    } catch (error) {
        console.error(error, 'Vendor Suspend Error...');
        return res.status(500).json({
            success: false,
            message: 'Server Error during Vendor suspension work...'
        });
    };
};

exports.reactivateVendorController = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const vendor = await User.findById(id).select('-password');
        if (!vendor || vendor.role !== 'vendor') {
            return res.status(404).json({ success: false, message: 'vendor not found...' })
        };

        if (vendor.status !== 'suspended') {
            return res.status(400).json({
                success: false,
                message: 'Only suspended vendors can be reactivated...',
            });
        }

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Re-Activate reason is required'
            });
        };

        vendor.status = 'approved';
        vendor.reActivateReason = reason;
        vendor.reActivateAt = new Date();
        await vendor.save();

        //todo: send email for suspention ....


        return res.status(200).json({
            success: true,
            message: 'Vendor Re-Activate successfully...',
            data: vendor,
        });


    } catch (error) {
        console.error(error, 'Vendor Re-Activate Error...');
        return res.status(500).json({
            success: false,
            message: 'Server Error during Vendor Re-Activate work...'
        });
    }
};

// Users 

exports.getAllUsersControllers = async (req, res) => {
    try {
        const users = await User.find({}).select('name email role status createdAt').sort({ createdAt: -1 }); // decending order e asbe...
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });

    } catch (error) {
        console.log(error, 'Get all users Error...');
        return res.status(500).json({
            success: false,
            message: 'Server Error get all users work...'
        });
    }
};


// Get Admin Statistics...
exports.getAdminStatsController = async (req, res) => {
    try {
        const [totalUsers,
            totalCustomers,
            vendorStats,
            approvedVendors,
            pendingVendors,
            rejectedVendors,
            suspendedVendors] = await Promise.all([
                // Total users...1
                User.countDocuments({}),

                // Total customers..2
                User.countDocuments({ role: 'customer' }),

                // Vendor breakdown using aggregation pipeline..3
                User.aggregate([
                    { $match: { role: 'vendor' } },
                    {
                        $group: {
                            _id: null,
                            totalVendors: { $sum: 1 },
                            approvedVendors: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                            pendingVendors: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                            rejectedVendors: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
                            suspendedVendors: { $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] } },
                        }
                    }
                ]),

                // Approved vendors separately delam
                User.countDocuments({ role: 'vendor', status: 'approved' }),

                // pending vendors separately delam
                User.countDocuments({ role: 'vendor', status: 'pending' }),

                // rejected vendors separately delam
                User.countDocuments({ role: 'vendor', status: 'rejected' }),

                // suspended vendors separately delam
                User.countDocuments({ role: 'vendor', status: 'suspended' }),


            ]);

        const vendorBreakdown = vendorStats[0] || {
            totalVendors: 0,
            approvedVendors: 0,
            pendingVendors: 0,
            rejectedVendors: 0,
            suspendedVendors: 0,

        };

        const stats = {
            overview: {
                totalUsers,
                totalCustomers,
                totalVendors: vendorBreakdown.totalVendors,
            },
            vendors: {
                approvedVendors: vendorBreakdown.approvedVendors || approvedVendors,
                pendingVendors: vendorBreakdown.pendingVendors || pendingVendors,
                rejectedVendors: vendorBreakdown.rejectedVendors || rejectedVendors,
                suspendedVendors: vendorBreakdown.suspendedVendors || suspendedVendors,
            },

            // Current Data Last 24 hours Registration Data...
            newRegistrations24Hours: await User.countDocuments({
                createdAt: {
                    $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            }),

            timestamp: new Date().toISOString()

        };

        return res.status(200).json({
            success: true,
            data: stats,
        });


    } catch (error) {
        console.error('Admin Stats related Error...:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error, Admin Stats related work...'
        });
    }

};