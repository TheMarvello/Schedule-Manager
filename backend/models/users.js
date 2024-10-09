import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0,
    },
    otp: {
        type: String,
        default: undefined,
    },
    otpExpires: {
        type: String,
        default: undefined,
    },
    schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
    // Add reference to the requests made by the employee
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request', // Reference the Request model
    }, ],
}, { timestamps: true });

export default mongoose.model("User", userSchema);