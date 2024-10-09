import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Link to Employee model
    location: {
        type: String,
        required: true
    }, // Work location
    startTime: {
        type: Date,
        required: true
    }, // Shift start time
    endTime: {
        type: Date,
        required: true
    }, // Shift end time (24-hour shifts)
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Admin who created the schedule
    status: {
        type: String,
        enum: ['assigned', 'completed'],
        default: 'assigned'
    }, // Schedule status ('assigned', 'completed')
    isCompleted: {
        type: Boolean,
        default: false
    }, // Whether the employee has completed the shift
}, { timestamps: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;