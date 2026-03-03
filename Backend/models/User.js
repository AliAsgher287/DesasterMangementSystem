const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    organizationName: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'responder', 'superadmin', 'donor'],
        default: 'responder'
    },
    contactNumber: {
        type: String,
        required: [true, 'Please add a contact number']
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'verified' // Default verified for non-admin roles
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordOTP: String,
    resetPasswordOTPExpire: Date
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password OTP
UserSchema.methods.getResetPasswordOTP = function () {
    // Generate 6 digit numeric code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const crypto = require('crypto');
    // Hash OTP and set to resetPasswordOTP field
    this.resetPasswordOTP = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    // Set expire (10 minutes)
    this.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000;

    return otp;
};

module.exports = mongoose.model('User', UserSchema);
