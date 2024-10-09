import express from 'express';
import { createEmployeeRequest, getEmployeeRequests, getEmployeeRequestsById, updateRequestStatus } from '../controllers/requestController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST route for employees to create requests
router.post('/request', requireSignIn, createEmployeeRequest);

// Route to get all employee requests (admin only)
router.get('/getAll', requireSignIn, isAdmin, getEmployeeRequests);

// Route to update the status of a specific request (admin only)
router.put('/:requestId/status', requireSignIn, isAdmin, updateRequestStatus);

// Route for employee or admin to get requests of a specific employee
router.get('/:employeeId', requireSignIn, getEmployeeRequestsById);



export default router;