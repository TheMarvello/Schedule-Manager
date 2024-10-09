import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    type: {
        type: String,
        enum: ['vacation', 'sick leave', 'personal leave', 'other'],
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);
export default Request;