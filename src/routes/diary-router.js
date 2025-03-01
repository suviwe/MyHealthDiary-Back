/*
Reiteistä:

POST /api/diary: Lisää uuden merkinnän.
GET /api/diary: Hakee käyttäjän omat merkinnät.
GET /api/diary/:id: Hakee yksittäisen merkinnän.
PUT /api/diary/:id: Muokkaa merkintää.
DELETE /api/diary/:id: Poistaa merkinnän.*/

import express from 'express';
import { body } from 'express-validator';
import { getEntries, getEntryById, postEntry, putEntry, deleteEntry, getSleepStats, getStepsStats, getWaterStats } from '../controllers/diary-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handler.js';

const diaryRouter = express.Router();

diaryRouter
  .route('/')
  .get(authenticateToken, getEntries)
  .post(
    authenticateToken,
    body('entry_date').notEmpty().isDate(),
    body('mood').notEmpty().isLength({min: 3, max: 50}),
    body('weight').isNumeric(),
    body('sleep_hours').isFloat({min: 0, max: 24}).withMessage("Sleep hours must be between 0 and 24"),
    body('notes').isLength({max: 1500}).escape(),
    validationErrorHandler,
    postEntry
  );

    //hakee yksittäisen merkinnän ID perusteella, päivittää merkinnän, poistaa merkinnän
    diaryRouter
    .route('/:id')
    .get(authenticateToken, getEntryById)
    .put(
      body("entry_date").optional(),
      body("mood").optional().isLength({ min: 3, max: 50 }).trim().escape(),
      body("weight").optional().isFloat({ min: 2, max: 200 }),
      body("sleep_hours").optional().isFloat({ min: 0, max: 24 }),
      body("notes").optional().isLength({ max: 1500 }).trim().escape(),
      validationErrorHandler,
      putEntry)

    .delete(authenticateToken, deleteEntry);

  diaryRouter.get('/stats/sleep', authenticateToken, getSleepStats);
  diaryRouter.get('/stats/steps', authenticateToken, getStepsStats);
  diaryRouter.get('/stats/water', authenticateToken, getWaterStats);


  export default diaryRouter;


