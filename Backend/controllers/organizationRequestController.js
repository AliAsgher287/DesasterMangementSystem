const Groq = require('groq-sdk');

const getGroq = () => {
    if (process.env.GROQ_API_KEY) {
        return new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return null;
};

const OrganizationRequest = require('../models/OrganizationRequest');

// @desc    Submit a new organization request and auto-prioritize via AI
// @route   POST /api/organization-requests
// @access  Private (Admin only)
exports.createRequest = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Only organizations can submit these requests' });
        }

        const { requestType, message, location, affectedPeople, resourceNeeded } = req.body;

        if (!requestType || !message || !location) {
            return res.status(400).json({ success: false, error: 'Please provide requestType, message, and location' });
        }

        // Heuristic fallback scoring (used if AI is unavailable)
        let priority = 'Normal';
        let aiScore = 30;
        let aiReasoning = '';

        const msgLower = message.toLowerCase();
        if (msgLower.includes('immediate') || msgLower.includes('urgent') || msgLower.includes('critical') || msgLower.includes('injured') || Number(affectedPeople) > 50) {
            priority = 'Urgent'; aiScore = 95;
            aiReasoning = `Urgent keywords or large-scale impact (${affectedPeople || 'many'} people) detected. Immediate intervention required for: ${requestType}.`;
        } else if (msgLower.includes('soon') || msgLower.includes('shortage') || Number(affectedPeople) > 20) {
            priority = 'High'; aiScore = 75;
            aiReasoning = `High-priority indicators detected. ${affectedPeople > 20 ? `${affectedPeople} people affected.` : 'Resource shortage reported.'} Prompt action recommended for: ${requestType}.`;
        } else if (Number(affectedPeople) > 5) {
            priority = 'Medium'; aiScore = 50;
            aiReasoning = `Moderate impact with ${affectedPeople} people affected. Scheduled response recommended for: ${requestType}.`;
        } else {
            priority = 'Normal'; aiScore = 30;
            aiReasoning = `Low-impact request with stable conditions. Routine handling recommended for: ${requestType}.`;
        }

        const groq = getGroq();

        if (groq) {
            try {
                const prompt = `
You are an expert AI emergency management system.
Your task is to analyze an emergency request from an organization and output a strictly valid JSON response containing its priority and score.

Request Data:
- Type: ${requestType}
- Message: ${message}
- Location: ${location}
- People Affected: ${affectedPeople || 'Unknown'}
- Resource Needed: ${resourceNeeded || 'None specified'}

Output JSON Format:
{
  "priority": "Urgent" | "High" | "Medium" | "Normal",
  "score": <number between 0 and 100>,
  "reasoning": "<short explanation>"
}

Only return the raw JSON object, no markdown formatting.
`;
                const completion = await groq.chat.completions.create({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'llama-3.3-70b-versatile',
                    response_format: { type: 'json_object' }
                });
                
                const aiResult = JSON.parse(completion.choices[0].message.content);

                priority = aiResult.priority || 'Medium';
                aiScore = aiResult.score || 50;
                aiReasoning = aiResult.reasoning || 'AI processed request';

            } catch (aiError) {
                console.error('Groq AI Error:', aiError.message);
                // Fallback to heuristic reasoning already set above
            }
        }

        const orgReq = await OrganizationRequest.create({
            organization: req.user.id,
            organizationName: req.user.organizationName,
            requestType,
            message,
            location,
            affectedPeople: Number(affectedPeople) || 0,
            resourceNeeded,
            priority,
            aiScore,
            aiReasoning
        });

        res.status(201).json({
            success: true,
            data: orgReq
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get organization requests
// @route   GET /api/organization-requests
// @access  Private (Super Admin gets all, Admin gets their own)
exports.getRequests = async (req, res, next) => {
    try {
        let query = {};

        // If organization admin, only show their own requests
        if (req.user.role === 'admin') {
            query.organization = req.user.id;
        }

        const reqs = await OrganizationRequest.find(query).sort({ aiScore: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reqs.length,
            data: reqs
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Update request status
// @route   PATCH /api/organization-requests/:id/status
// @access  Private (Super Admin)
exports.updateRequestStatus = async (req, res, next) => {
    try {
        if (req.user.role !== 'superadmin') {
            return res.status(403).json({ success: false, error: 'Not authorized to update status' });
        }

        const { status } = req.body;

        if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const reqUpdate = await OrganizationRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!reqUpdate) {
            return res.status(404).json({ success: false, error: 'Request not found' });
        }

        res.status(200).json({
            success: true,
            data: reqUpdate
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
