import Request from '../models/request.js';
import userModel from '../models/users.js';
// Controller to get all employee requests
export const getEmployeeRequests = async(req, res) => {
    try {
        const requests = await Request.find().populate('employeeId', 'name email'); // Populate employee details
        res.status(200).json({
            success: true,
            requests,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employee requests!',
            error,
        });
    }
};

// Controller to update request status (approve/reject)
export const updateRequestStatus = async(req, res) => {
    const { requestId } = req.params;
    const { status } = req.body; // Can be 'approved' or 'rejected'

    try {
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found!' });
        }

        // Update the request status
        request.status = status;
        await request.save();

        res.status(200).json({
            success: true,
            message: `Request has been ${status}!`,
            request,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error updating request status!',
            error,
        });
    }
};

// Controller to get requests for a specific employee (Employee or Admin)
export const getEmployeeRequestsById = async(req, res) => {
    const { employeeId } = req.params;
    const user = await userModel.findOne({ _id: req.user._id });
    try {
        // Check if the requester is the employee or an admin
        if (req.user._id.toString() !== employeeId && user.role !== 1) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access!',
            });
        }

        // Find requests for the specific employee
        const requests = await Request.find({ employeeId }).populate('employeeId', 'name email');
        if (!requests.length) {
            return res.status(404).json({
                success: false,
                message: 'No requests found for this employee.',
            });
        }

        res.status(200).json({
            success: true,
            requests,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching requests!',
            error,
        });
    }
};

// Controller for creating a new request (for employees)
export const createEmployeeRequest = async(req, res) => {
    const { type, reason, startDate, endDate } = req.body;
    const employeeId = req.user._id; // Assuming the user is authenticated and req.user contains their data

    try {
        // Create a new request object
        const newRequest = new Request({
            employeeId,
            type,
            reason,
            startDate,
            endDate,
            status: 'pending', // Requests are pending by default
        });

        // Save the request to the database
        await newRequest.save();

        res.status(201).json({
            success: true,
            message: 'Request created successfully!',
            request: newRequest,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error creating request!',
            error,
        });
    }
};