import Schedule from '../models/schedule.js'; // Schedule model
import userModel from "../models/users.js";


export const createScheduleController = async(req, res) => {
    const { employeeEmail, location, startTime, endTime } = req.body;
    try {
        const user = await userModel.findOne({ email: employeeEmail });
        console.log(user);
        const employeeId = user._id
        console.log(employeeId)
        const newSchedule = new Schedule({
            employeeId,
            location,
            startTime,
            endTime,
            createdBy: req.user._id // The admin who created the schedule
        });
        const savedSchedule = await newSchedule.save();
        user.schedules.push(savedSchedule._id);
        await user.save();
        res.status(201).send({
            success: true,
            message: 'Schedule created successfully!!',
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error creating schedule!",
            error
        });
    }
};


// GET Get a user along with their schedules
export const getUserSchedulesController = async(req, res) => {
    const employeeEmail = req.body.employeeEmail;
    try {
        // Find the user by email and populate the schedules array
        const user = await userModel.findOne({ email: employeeEmail }).populate('schedules');

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Employee not found!',
            });
        }

        // Send the schedules as response
        res.status(200).send({
            success: true,
            message: 'Schedules fetched successfully!',
            schedules: user.schedules // Populated schedule documents
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching schedules!',
            error
        });
    }
};

export const markScheduleCompleted = async(req, res) => {
    const { scheduleId } = req.body; // Schedule ID passed in the body
    console.log(req);
    console.log(req.user._id);
    try {
        // Find the schedule by ID and ensure it belongs to the current employee
        const schedule = await Schedule.findOne({
            _id: scheduleId,
            employeeId: req.user._id // Ensure the logged-in employee owns the schedule
        });

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found or you do not have access to this schedule.',
            });
        }

        // Update the schedule status to 'completed'
        schedule.status = 'completed';
        await schedule.save();

        res.status(200).json({
            success: true,
            message: 'Schedule marked as completed!',
            schedule
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error updating the schedule!',
            error
        });
    }
};