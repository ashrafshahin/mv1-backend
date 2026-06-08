const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const { getPendingVendorsController, getAllVendorsController, getAllApprovedVendorController, getAllRejectedVendorController, approveVendorController, rejectVendorController, getAllUsersControllers, getAdminStatsController, suspendVendorController, reactivateVendorController, getSuspendedVendorsController } = require("../controllers/adminController");

const router = express.Router();

// all admin routes protected + only admin access
router.use(protect, restrictTo('admin'));

// vendor management routes
router.get('/vendors/all-pending-vendors', getPendingVendorsController);
router.get('/vendors/all-vendors', getAllVendorsController);
router.get('/vendors/all-approved-vendors', getAllApprovedVendorController);
router.get('/vendors/all-rejected-vendors', getAllRejectedVendorController);
router.get('/vendors/all-suspended-vendors', getSuspendedVendorsController);

router.patch('/vendors/:id/approve', approveVendorController);
router.patch('/vendors/:id/reject', rejectVendorController);
router.patch('/vendors/:id/suspend', suspendVendorController);

router.patch('/vendors/:id/re-activate', reactivateVendorController);

router.get('/stats', getAdminStatsController );

// Basic user management
router.get('/users/all-users', getAllUsersControllers);


module.exports = router;

