import express from 'express';
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createScheduleController, getUserSchedulesController, markScheduleCompleted } from '../controllers/scheduleController.js';

//router object
const router = express.Router();

//ROUTE DEFINITIONS
//routing
// Create Schedule  || METHOD POST
router.post("/create-schedule", requireSignIn, isAdmin, createScheduleController);
// GET /user/:id/schedules: Get a user along with their schedules
router.get('/employee/schedules', requireSignIn, getUserSchedulesController);
router.post('/employee/schedules/markCompleted', requireSignIn, markScheduleCompleted);


export default router;