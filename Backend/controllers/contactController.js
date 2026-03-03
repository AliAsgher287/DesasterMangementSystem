const Contact = require('../models/Contact');

// @desc    Submit a contact query
// @route   POST /api/contacts
// @access  Public
exports.submitContact = async (req, res, next) => {
    try {
        const contact = await Contact.create(req.body);

        res.status(201).json({
            success: true,
            data: contact
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get all contact queries
// @route   GET /api/contacts
// @access  Private/SuperAdmin
exports.getContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find().sort('-createdAt');

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Update contact status
// @route   PUT /api/contacts/:id
// @access  Private/SuperAdmin
exports.updateContactStatus = async (req, res, next) => {
    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ success: false, error: 'Contact not found' });
        }

        contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
