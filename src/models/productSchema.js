const mongoose = require('mongoose');
const { maxLength, trim, number, url, lowercase } = require('zod');
const { required } = require('zod/mini');
const { Schema } = mongoose;

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
        type: String,
        required: true,
        min: 0,
    },
    discountPrice: {
        type: String,
        min: 0,
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
        ref: User,
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
productSchema.index({ vendor: 1, ststus: 1 });
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);


