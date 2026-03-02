const User = require('../models/User');
const jwt = require('jsonwebtoken');
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

        res.status(200).json({
            success: true,
            data: 'Email sent (placeholder logic)'
        });
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
