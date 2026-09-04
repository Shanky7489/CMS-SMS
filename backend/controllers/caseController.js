import Case from '../models/Case.js';

// @desc    Create new case
// @route   POST /api/cases
// @access  Public (for now)
export const createCase = async (req, res) => {
    try {
        const { id, clientId, clientName, age, sex, city, state, category, details, targetSme, documents } = req.body;

        const safeDocuments = documents ? documents.map(doc => ({
            name: doc.name,
            size: doc.size,
            url: doc.url // Store base64 URL directly in DB
        })) : [];

        const newCase = await Case.create({
            id,
            clientId,
            clientName,
            age,
            sex,
            city,
            state,
            category,
            details,
            targetSme,
            documents: safeDocuments,
            status: 'Pending'
        });

        res.status(201).json({
            message: 'Case registered successfully',
            case: newCase
        });
    } catch (error) {
        console.error('Error in createCase:', error);
        res.status(500).json({ message: 'Server error while creating case', error: error.message });
    }
};

// @desc    Get all cases
// @route   GET /api/cases
// @access  Public (for now)
export const getCases = async (req, res) => {
    try {
        const { clientId, targetSme } = req.query;
        let query = {};
        
        if (clientId) {
            query.clientId = clientId;
        }

        if (targetSme) {
            query.targetSme = targetSme;
        }

        const cases = await Case.find(query).sort({ createdAt: -1 }); // newest first
        res.status(200).json(cases);
    } catch (error) {
        console.error('Error in getCases:', error);
        res.status(500).json({ message: 'Server error while fetching cases' });
    }
};

// @desc    Update case status
// @route   PATCH /api/cases/:id/status
// @access  Public (for now)
export const updateCaseStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedCase = await Case.findOneAndUpdate(
            { id }, 
            { status },
            { new: true }
        );

        if (!updatedCase) {
            return res.status(404).json({ message: 'Case not found' });
        }

        res.status(200).json({ message: 'Case status updated', case: updatedCase });
    } catch (error) {
        console.error('Error updating case status:', error);
        res.status(500).json({ message: 'Server error while updating case status' });
    }
};

// @desc    Add message to case
// @route   POST /api/cases/:id/messages
// @access  Public (for now)
export const addCaseMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { sender, text, attachments } = req.body;

        if (!sender || (!text && (!attachments || attachments.length === 0))) {
            return res.status(400).json({ message: 'Sender and text or attachments are required' });
        }

        const updatedCase = await Case.findOneAndUpdate(
            { id },
            { $push: { messages: { sender, text: text || '', attachments: attachments || [] } } },
            { new: true }
        );

        if (!updatedCase) {
            return res.status(404).json({ message: 'Case not found' });
        }

        res.status(200).json({ message: 'Message added successfully', case: updatedCase });
    } catch (error) {
        console.error('Error adding case message:', error);
        res.status(500).json({ message: 'Server error while adding message' });
    }
};
