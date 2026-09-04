import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        smsId: {
            type: String,
            required: [true, 'Please add a Unique SMS ID'],
            unique: true,
            trim: true,
            uppercase: true
        },
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true
        },
        experience: {
            type: String,
            required: function() { return this.role === 'SMS'; },
            trim: true
        },
        position: {
            type: String,
            trim: true,
            default: ''
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false // When we query for user, password won't be returned by default
        },
        role: {
            type: String,
            enum: ['CMS', 'SMS'],
            required: [true, 'Please specify a role (CMS or SMS)']
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

// Encrypt password before saving to the database
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;