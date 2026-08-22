import { Router } from 'express';
import { noteController } from '../controllers/noteController.js';

const router = Router();

// /api/v1/notes
router.get('/', (req, res, next) => noteController.getNotes(req, res, next));
router.post('/', (req, res, next) => noteController.createNote(req, res, next));
router.post('/summarize', (req, res, next) => noteController.summarizeNote(req, res, next));
router.get('/:id', (req, res, next) => noteController.getNoteById(req, res, next));
router.put('/:id', (req, res, next) => noteController.updateNote(req, res, next));
router.delete('/:id', (req, res, next) => noteController.deleteNote(req, res, next));

export default router;
