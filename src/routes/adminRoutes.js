const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const { getPendingVendorsController, getAllVendorsController, getAllApprovedVendorController, getAllRejectedVendorController, approveVendorController, rejectVendorController, getAllUsersControllers } = require("../controllers/adminController");
const router = express.Router();

// all admin routes protected + only admin access
router.use(protect, restrictTo('admin'));

// vendor management routes
router.get('/vendors/pending', getPendingVendorsController);
router.get('/vendors/all-vendors', getAllVendorsController);
router.get('/vendors/all-approved-vendors', getAllApprovedVendorController);
router.get('/vendors/all-rejected-vendors', getAllRejectedVendorController);
router.patch('/vendors/:id/approve', approveVendorController);
router.patch('/vendors/:id/reject', rejectVendorController);

// Basic user management
router.get('/users/all-users', getAllUsersControllers);


module.exports = router;

