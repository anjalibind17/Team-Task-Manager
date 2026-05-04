import express from 'express';
import { body, param } from 'express-validator';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createProject, getProjects, getProject, updateProject, deleteProject, addMember, removeMember } from '../controllers/project.controller.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .post([body('name').trim().isLength({ min: 2 }).withMessage('Project name is required')], validate, createProject)
  .get(getProjects);

router.route('/:id')
  .get([param('id').isMongoId().withMessage('Invalid project id')], validate, getProject)
  .put([
    param('id').isMongoId(),
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Project name must be at least 2 characters'),
    body('status').optional().isIn(['Active', 'Completed', 'On Hold'])
  ], validate, updateProject)
  .delete([param('id').isMongoId()], validate, deleteProject);

router.post('/:id/members', [
  param('id').isMongoId(),
  body('email').isEmail().withMessage('Valid member email is required'),
  body('role').optional().isIn(['Admin', 'Member'])
], validate, addMember);

router.delete('/:id/members/:userId', [param('id').isMongoId(), param('userId').isMongoId()], validate, removeMember);

export default router;
