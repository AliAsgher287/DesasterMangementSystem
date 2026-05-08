const Groq = require('groq-sdk');

const getGroq = () => {
    if (process.env.GROQ_API_KEY) {
        return new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return null;
};

const CitizenHelp = require('../models/CitizenHelp');

exports.submitHelpRequest = async (req, res, next) => {
    try {
        const { description, contactNumber, location, helpTypes, isInjured, isImmediateDanger, peopleAffected } = req.body;


        let calculatedSeverity = 1;
        let aiScore = 20;
        let aiReasoning = '';

        if (isImmediateDanger) {
            calculatedSeverity = 10; aiScore = 100;
            aiReasoning = 'Immediate life-threatening danger reported. Maximum priority assigned for emergency dispatch.';
        } else if (isInjured || (helpTypes && (helpTypes.includes('Rescue') || helpTypes.includes('Medical')))) {
            calculatedSeverity = 8; aiScore = 80;
            aiReasoning = `Injuries or need for ${helpTypes?.includes('Medical') ? 'medical' : 'rescue'} assistance reported. High priority assigned for rapid response.`;
        } else if ((peopleAffected && peopleAffected > 5) || (helpTypes && helpTypes.includes('Shelter'))) {
            calculatedSeverity = 6; aiScore = 60;
            aiReasoning = `${peopleAffected > 5 ? `${peopleAffected} people affected` : 'Shelter need reported'}. Elevated priority assigned for coordinated relief.`;
        } else if ((helpTypes && helpTypes.includes('Food')) || (peopleAffected && peopleAffected > 1)) {
            calculatedSeverity = 4; aiScore = 40;
            aiReasoning = `Food or basic needs assistance required for ${peopleAffected || 'multiple'} people. Medium priority assigned.`;
        } else {
            calculatedSeverity = 2; aiScore = 20;
            aiReasoning = 'General assistance request with stable conditions. Normal priority assigned.';
        }

        const groq = getGroq();
        if (groq) {
            try {
                const prompt = `
You are an expert AI emergency management system evaluating a citizen's plea for help.
Analyze the following request and return a strictly valid JSON containing a severity (1-10), a score (0-100), and reasoning.

Request Data:
- Description: ${description}
- Help Types: ${helpTypes.join(', ')}
- Injured: ${isInjured}
- Immediate Danger: ${isImmediateDanger}
- People Affected: ${peopleAffected}
- Location: ${location || 'Unknown'}

Output JSON Format:
{
  "severity": <number 1 to 10>,
  "score": <number 0 to 100>,
  "reasoning": "<short explanation>"
}
Only return the raw JSON object, no markdown.`;

                const completion = await groq.chat.completions.create({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'llama-3.3-70b-versatile',
                    response_format: { type: 'json_object' }
                });

                const aiResult = JSON.parse(completion.choices[0].message.content);

                calculatedSeverity = aiResult.severity || calculatedSeverity;
                aiScore = aiResult.score || aiScore;
                aiReasoning = aiResult.reasoning || 'AI processed request';

            } catch (aiError) {
                console.error('Groq AI Error:', aiError.message);
                // Keep heuristic reasoning if AI fails
            }
        }

        const request = await CitizenHelp.create({
            description,
            severity: calculatedSeverity,
            contactNumber,
            location,
            helpTypes,
            isInjured,
            isImmediateDanger,
            peopleAffected: peopleAffected || 1,
            aiScore,
            aiReasoning
        });

        res.status(201).json({
            success: true,
            data: request
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get all citizen help requests
// @route   GET /api/citizen-help
// @access  Private (Admin only)
exports.getCitizenHelpRequests = async (req, res, next) => {
    try {
        const requests = await CitizenHelp.find().sort({ aiScore: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Update citizen help request status
// @route   PUT /api/citizen-help/:id
// @access  Private (Admin only)
exports.updateHelpStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const request = await CitizenHelp.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        if (!request) {
            return res.status(404).json({ success: false, error: 'Request not found' });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
