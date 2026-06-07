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

exports.approveVendorController = async (req, res) => {
    try {
        const { vendorId } = requestAnimationFrame.params;
        const vendor = await User.findById(vendorId);
        if (!vendor || vendor.role !== 'vendor') {
            return res.status(404).json({ success: false, message: 'vendor not found...' })
        };

        vendor.status = 'approved';
        vendor.approvedAt = new Date();
        await vendor.save();

        // todo: send approval email


        return res.status(200).json({ success: true, message: 'Vendor Approved...' })

    } catch (error) {
        console.log(error, 'Vendor Approval Error...');
        return res.status(500).json({
            success: false,
            message: 'Server Error during Vendor Approval...'
        })
    }
};

exports.rejectVendorController = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { reason } = req.body;
        if (!reason) {
            return res.status(400).json({ success: false, message: 'Rejection reason is required...' });
        };
        const vendor = await User.findOneAndUpdate(
            { vendorId: _id, role: 'vendor', status: 'pending' },
            { status: 'rejected', rejectReason: reason, approvedAt: null },
            { new: true },

        ).save('name email shopName status rejectReason');

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found or already Approved...'
            });
        };

        //todo: send email for rejection ....

        res.status(200).json({
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


// Users 

exports.getAllUsersControllers = async (req, res) => {
    try {
        const users = await User.find({}).select('name email role status createdAt').sort({createdAt: -1});
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
