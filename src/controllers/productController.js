const Product = require('../models/productSchema');
const { createProductSchema } = require('../validations/product.validation');
const validate = require('../middlewares/validateMiddleware');
const { uploadProductImages } = require('../middlewares/uploads');


// Create product
exports.createProductController = [
    uploadProductImages,
    // Zod validation on whole schema
    validate(createProductSchema),
    async (req, res) => {
        try {
            const vendorId = req.user.id;
            const images = req.files ?
                req.files.map(file => ({ url: file.path, publicId: file.filename }))
                : [];

            if (images.length === 0) {
                return res.status(400).json({ message: 'At least one product image is required...' });
            };

            // images length boro thaka mane, at least akta image jodi thake, index 0 te ja ase, isMain true korbe
            if (images.length > 0) images[0].isMain = true;

            const product = new Product({
                ...req.body,
                vendor: vendorId,
                images,
                slug: req.body.title
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-zA-Z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
            });
            await product.save();
            res.status(201), json({
                success: true,
                message: 'Product created successfully, Admin approval required...',
                product: product,
            });

        } catch (error) {
            console.error('Product create related Error...:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
];

// Get all products
exports.getMyProductsController = async (req, res) => {
    try {
        const products = await Product.find({ vendor: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error('Get all product related Error...:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error, Get all products related...'
        });
    }
};