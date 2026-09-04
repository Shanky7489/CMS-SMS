import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new specialist/user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { smsId, name, experience, position, password, role } = req.body;

        if (!smsId || !name || !password || !role) {
            return res.status(400).json({ message: 'SMS ID, name, password and role are required' });
        }

        if (role === 'SMS' && !experience) {
            return res.status(400).json({ message: 'Experience is required for SMS role' });
        }

        // Check if user already exists (SMS ID must be unique)
        const userExists = await User.findOne({ smsId: smsId.toUpperCase() });

        if (userExists) {
            return res.status(400).json({ message: 'This SMS ID is already registered' });
        }

        // Create new user
        const user = await User.create({
            smsId,
            name,
            experience,
            position,
            password,
            role,
        });

        if (user) {
            generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                smsId: user.smsId,
                name: user.name,
                experience: user.experience,
                position: user.position,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        // Handle duplicate key error from MongoDB as a friendly message
        if (error.code === 11000) {
            return res.status(400).json({ message: 'This SMS ID is already registered' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { smsId, password, role } = req.body;

        if (!smsId || !password) {
            return res.status(400).json({ message: 'SMS ID and password are required' });
        }

        // Find user by smsId (we need to explicitly select password because we set select: false in model)
        const user = await User.findOne({ smsId: smsId.toUpperCase() }).select('+password');

        if (user && (await user.matchPassword(password))) {
            // Optional: enforce that the user is logging into the correct portal
            if (role && user.role !== role) {
                return res.status(401).json({ message: `This ID is not registered under the ${role} portal` });
            }

            generateToken(res, user._id);

            res.json({
                _id: user._id,
                smsId: user.smsId,
                name: user.name,
                experience: user.experience,
                position: user.position,
                role: user.role, // Frontend uses this to decide where to redirect
            });
        } else {
            res.status(401).json({ message: 'Invalid SMS ID or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
    // Clear the jwt cookie by setting its expiration to the past
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get all SMS users
// @route   GET /api/auth/sms-users
// @access  Public
export const getSmsUsers = async (req, res) => {
    try {
        const smsUsers = await User.find({ role: 'SMS' }).select('smsId name');
        res.status(200).json(smsUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching SMS users' });
    }
};