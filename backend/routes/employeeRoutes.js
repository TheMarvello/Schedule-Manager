import express from 'express';
import { createEmployee, editEmployee, deleteEmployee } from '../controllers/employeeController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes for employee management
router.post('/', requireSignIn, isAdmin, createEmployee); // Create new employee
router.put('/:id', requireSignIn, isAdmin, editEmployee); // Edit existing employee
router.delete('/:id', requireSignIn, isAdmin, deleteEmployee); // Delete employee

export default router;