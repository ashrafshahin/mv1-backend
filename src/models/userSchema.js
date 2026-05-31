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
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return; 
    this.password = await bcrypt.hash(this.password, 12);
    
});

// compare password...
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
};

module.exports = mongoose.model('User', userSchema)







// createdAt- kobe registration korse...
// this bolte userSchema bujaitese. 
// this deye arrow function kaj kore na...
// pre() mane save er age kichu akta kore save korba...
// next akta parametre neya hoise...


// { timestamps: true } - aita dele auto create and update date and time dai so alada kore likte hobe na ... just expiresAt delai hobe...