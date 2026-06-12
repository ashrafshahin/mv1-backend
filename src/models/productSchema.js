const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./userSchema')

const productSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Product title is required...'],
        trim: true,
        maxLength: 200,
    },
    description: {
        type: String,
        required: [true, 'Describe your product...'],
        maxLength: 5000,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discountPrice: {
        type: Number,
        min: 0,
        validate: {
            validator: function (value) {
                return !value || value <= this.price;
            },
            message: 'Discount price cannot exceed regular price'
        },
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    subCategory: {
        type: String,
    },
    brand: {
        type: String,
    },

    // Inventory
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
    },

    // Images
    images: [{
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
        },
        isMain: {
            type: Boolean,
            default: false,
        },
    }],

    // vendor Information
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending',
    },

    // Additional information
    tags: [String],
    weight: Number,
    dimension: {
        length: Number,
        width: Number,
        height: Number,
    },

    // SEO and Visibility..
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,

    },

}, { timestamps: true });

// Index for fast search
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ vendor: 1, status: 1 });
productSchema.index({ category: 1 });

// slug work
// productSchema.pre('save', function (next) {
//     if (!this.slug) {
//         this.slug = this.title
//             .toLowerCase()
//             .replace(/[^a-zA-Z0-9]+/g, '-')
//             .replace(/^-+|-+$/g, '');
//     }

//     next();
// });

module.exports = mongoose.model('Product', productSchema);


