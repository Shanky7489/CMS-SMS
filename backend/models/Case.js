import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: String, required: true },
    // URL/Base64 can be stored here if small enough, but usually we'd store an S3 path
    url: { type: String }
});

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    text: { type: String, required: true },
    attachments: [documentSchema],
    createdAt: { type: Date, default: Date.now }
});

const caseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    category: { type: String, required: true },
    details: { type: String, required: true },
    targetSme: { type: String, required: true },
    documents: [documentSchema],
    messages: [messageSchema],
    status: { type: String, default: 'Pending', enum: ['Pending', 'Under Review', 'Completed'] }
}, {
    timestamps: true
});

const Case = mongoose.model('Case', caseSchema);

export default Case;
