const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ success: false, error: 'Please provide request body' });
    }
    const { name, email, password, organizationName, location, role, contactNumber } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide name, email and password' });
    }

    // Prevent registration as superadmin via API
    if (role === 'superadmin') {
        return res.status(403).json({ success: false, error: 'Cannot register as superadmin' });
    }

    try {
        const user = await User.create({
            name,
            email,
            password,
            organizationName,
            location,
            role: role || 'responder',
            contactNumber,
            status: role === 'admin' ? 'pending' : 'verified'
        });

        console.log(`User registered: ${user.name} (${user.email}) - Org: ${user.organizationName}`);

        // Notify Super Admin if it's a new organization
        if (user.role === 'admin') {
            try {
                await sendEmail({
                    email: process.env.SUPER_ADMIN_EMAIL,
                    subject: 'New Organization Registration - Verification Required',
                    html: `
                        <div style="font-family: Arial, sans-serif; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
                            <h2 style="color: #1a73e8;">Warm Hands Platform</h2>
                            <p>A new organization has registered and is awaiting your verification.</p>
                            <hr style="border: 0; border-top: 1px solid #eeeeee;">
                            <p><strong>Organization Name:</strong> ${user.organizationName}</p>
                            <p><strong>Admin Name:</strong> ${user.name}</p>
                            <p><strong>Institutional Email:</strong> ${user.email}</p>
                            <p><strong>Location:</strong> ${user.location || 'Not provided'}</p>
                            <p><strong>Contact:</strong> ${user.contactNumber}</p>
                            <hr style="border: 0; border-top: 1px solid #eeeeee;">
                            <p>Please log in to the Super Admin Dashboard to approve or reject this registration.</p>
                            <a href="http://localhost:3000/authentication/login" style="display: inline-block; padding: 10px 20px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
                        </div>
                    `
                });
            } catch (err) {
                console.error(`Email notification error: ${err.message}`);
                // Don't fail the registration if email fails
            }
        }

        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.error(`Registration error: ${err.message}`);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ success: false, error: 'Please provide request body' });
    }
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for Super Admin fixed credentials
    if (
        email.toLowerCase().trim() === process.env.SUPER_ADMIN_EMAIL.toLowerCase().trim() &&
        password.trim() === process.env.SUPER_ADMIN_PASSWORD.trim()
    ) {
        const token = jwt.sign(
            { id: 'superadmin', role: 'superadmin' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        console.log(`Super Admin logged in`);

        return res.status(200).json({
            success: true,
            token,
            role: 'superadmin',
            name: process.env.SUPER_ADMIN_NAME,
            organizationName: 'Warm Hands Platform',
            status: 'verified'
        });
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        console.log(`User logged in: ${user.name} (${user.email})`);

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error(`Login error: ${err.message}`);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        // Super admin is not in DB
        if (req.user.role === 'superadmin') {
            return res.status(200).json({
                success: true,
                data: req.user
            });
        }

        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: 'There is no user with that email' });
        }

        // Get reset OTP
        const otp = user.getResetPasswordOTP();

        await user.save({ validateBeforeSave: false });

        const message = `
            <div style="font-family: Arial, sans-serif; border: 1px solid #e0e0e0; padding: 40px; border-radius: 20px; max-width: 600px; margin: auto; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1a73e8; margin: 0; font-size: 28px;">Warm Hands</h1>
                    <p style="color: #666; font-size: 14px; margin-top: 5px;">Disaster Coordination Platform</p>
                </div>
                
                <h2 style="color: #333; text-align: center; font-size: 22px;">Verification Code</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">Hello ${user.name},</p>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">You requested to reset your password. Please use the following 6-digit verification code to proceed:</p>
                
                <div style="text-align: center; margin: 40px 0;">
                    <div style="display: inline-block; padding: 20px 40px; background-color: #f8f9fa; border: 2px dashed #1a73e8; border-radius: 15px;">
                        <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; letter-spacing: 15px; color: #1a73e8;">${otp}</span>
                    </div>
                </div>
                
                <p style="color: #e67e22; font-size: 14px; text-align: center; font-weight: bold;">This code will expire in 10 minutes.</p>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px; line-height: 1.5;">If you did not request this, please ignore this email or contact support if you have concerns.</p>
                    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">&copy; 2024 Warm Hands Platform. All rights reserved.</p>
                </div>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your Password Reset Code - Warm Hands',
                html: message
            });

            res.status(200).json({
                success: true,
                data: 'OTP sent to email'
            });
        } catch (err) {
            console.error(err);
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ success: false, error: 'Email could not be sent' });
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Verify Reset OTP
// @route   POST /api/auth/verifyresetotp
// @access  Public
exports.verifyResetOTP = async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, error: 'Please provide email and OTP' });
    }

    try {
        const resetPasswordOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordOTP,
            resetPasswordOTPExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        res.status(200).json({
            success: true,
            data: 'OTP verified successfully'
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res, next) => {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
        return res.status(400).json({ success: false, error: 'Please provide email, OTP and new password' });
    }

    try {
        // Get hashed OTP
        const resetPasswordOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordOTP,
            resetPasswordOTPExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;

        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    res.status(statusCode).json({
        success: true,
        token,
        role: user.role,
        name: user.name,
        organizationName: user.organizationName,
        contactNumber: user.contactNumber,
        status: user.status
    });
};
