const mongoose = require('mongoose')
// const {Schema} = mongoose
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required...'],
        trim: true,
        match: [/^.{5,}$/, 'Name must be at least 5 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required...'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,

    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required...'],
        select: false,
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain uppercase, lowercase, number and special character"
        ],
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'vendor'],
        default: 'customer',
    },

 // ==== vendor work... ===== //
    shopName: {
        type: String,
        unique: true,
        sparse: true,
    },
    shopDestription: {
        type: String,
        trim: true,
    },
    shopAddress: {
        type: String,
        trim: true,
    },
    shopLogo: {
        type: String,
    },
    nidNumber: {
        type: String,
        unique: true,
        sparse: true,
    },
    bankInfo: {
        bankName: String,
        branchName: String,
        accountNumber: String,
        accountHolder: String,
    },
    status: {
        type: String,
        enum: ['customer', 'pending', 'approved', 'rejected', 'suspended'],
        default: 'customer',
    },
    rejectReason: {
        type: String,
       
    },
    suspendReason: {
        type: String,      
    },
    reActivateReason: {
        type: String,
    },
    reActivateAt: {
        type: Date,
    },
    rejectedAt: {
        type: Date,     
    },
    suspendedAt: {
        type: Date,      
    },

//...... vendor work ends ..... ...//

    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    refreshTokens: [{
        token: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
        expiresAt: {
            type: Date,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },  

}, { timestamps: true });

// Password Hash before sending to database...
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);

});

// compare password...
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
};

// === THIS IS IN VIDEO ==== ❌
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('role') && this.role !== 'vendor') {
//         this.status = 'pending'
//     }
//     if (this.role !== 'vendor') {
//         this.status = 'customer'
//         this.shopName = undefined
//     }
//     next()
// })

// === ❌===

userSchema.pre('save', async function (next) {
    if (this.isModified('role')) {
        if (this.role === 'vendor') {
            this.status = 'pending'
        } else {
            this.shopName = undefined
        }
    }
    next()
})

module.exports = mongoose.model('User', userSchema)







// createdAt- kobe registration korse...
// this bolte userSchema bujaitese. 
// this deye arrow function kaj kore na...
// pre() mane save er age kichu akta kore save korba...
// next akta parametre neya hoise...


// { timestamps: true } - aita dele auto create and update date and time dai so alada kore likte hobe na ... just expiresAt delai hobe...