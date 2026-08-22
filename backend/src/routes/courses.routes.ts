import { Router } from 'express';
import { courseController } from '../controllers/courseController.js';

const router = Router();

// /api/v1/courses
router.get('/', (req, res, next) => courseController.getCourses(req, res, next));
router.post('/', (req, res, next) => courseController.createCourse(req, res, next));
router.post('/calculate', (req, res, next) => courseController.calculateGrade(req, res, next));
router.get('/:id', (req, res, next) => courseController.getCourseById(req, res, next));
router.put('/:id', (req, res, next) => courseController.updateCourse(req, res, next));
router.delete('/:id', (req, res, next) => courseController.deleteCourse(req, res, next));

export default router;
