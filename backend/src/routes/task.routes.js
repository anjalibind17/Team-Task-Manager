import express from 'express';
import { body, param } from 'express-validator';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createTask, getTasks, getTask, updateTask, deleteTask } from '../controllers/task.controller.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .post([
    body('title').trim().isLength({ min: 2 }).withMessage('Task title is required'),
    body('project').isMongoId().withMessage('Valid project is required'),
    body('assignedTo').isMongoId().withMessage('Valid assignee is required'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('status').optional().isIn(['Todo', 'In Progress', 'Completed']),
    body('dueDate').isISO8601().withMessage('Valid due date is required')
  ], validate, createTask)
  .get(getTasks);

router.route('/:id')
  .get([param('id').isMongoId()], validate, getTask)
  .put([
    param('id').isMongoId(),
    body('title').optional().trim().isLength({ min: 2 }).withMessage('Task title must be at least 2 characters'),
    body('assignedTo').optional().isMongoId().withMessage('Valid assignee is required'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('status').optional().isIn(['Todo', 'In Progress', 'Completed']),
    body('dueDate').optional().isISO8601().withMessage('Valid due date is required')
  ], validate, updateTask)
  .delete([param('id').isMongoId()], validate, deleteTask);

export default router;
