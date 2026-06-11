const multer = require("multer");
const claudinary = require('../config/claudinary');
const { ClaudinaryStorage } = require('multer-storage-cloudinary');


// Vendor logo upload
const logoStorage = new CloudinaryStorage({
    claudinary,
    params: (req, file) => ({
        folder: 'vendor/logo',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        public_id: `vendorlogo-${req.body.email || 'unknown'}-${Date.now()}`,
        transformation: [{
            width: 500,
            height: 500,
            crop: 'limit',
            quality: 'auto',
        }]
    })
});

// Vendor NID / Documents upload
const nidStorage = new CloudinaryStorage({
    claudinary,
    params: (req, file) => ({
        folder: 'vendor/nids',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
        public_id: `vendorNid-${req.body.nidNumber || 'unknown'}-${Date.now()}`,
        transformation: [{
            quality: 'auto',
        }]
    })
});

// Product image upload
const productStorage = new CloudinaryStorage({
    claudinary,
    params: (req, file) => ({
        folder: 'product',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        public_id: `product-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        transformation: [{
            width: 800,
            height: 800,
            crop: 'limit',
            quality: 'auto',
        }]
    })
});


// file filter (extra security)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|pdf/;
    const exactName = allowedTypes.test(file.originalname.toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (exactName && mimeType) {
        return cb(null, true)
    }
    cb(new Error('Only images (jpg, jpeg, png, webp) and PDF allowed'));

};

// Logo Uploader (single file)
const uploadLogo = multer({
    storage: logoStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5mb max
    fileFilter

}).single('shopLogo'); // field name shopLogo


// NID Uploader (single file)
const uploadNid = multer({
    storage: nidStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10mb max
    fileFilter

}).single('nidScan'); // field name nidScan


// Product multiple images upload 
const uploadProductImages = multer({
    storage: productStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Max 5mb per image
    },
    fileFilter

}).array('images', 8);

module.exports = { uploadLogo, uploadNid, uploadProductImages };