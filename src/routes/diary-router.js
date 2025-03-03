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
    body('mood').optional().isLength({min: 2, max: 50}),
    body('mood_intensity').notEmpty().isInt({ min: 1, max: 5 }).withMessage('Mood intensity must be between 1 and 5'),
    body('weight').optional().isNumeric(),
    body('sleep_hours').optional().isFloat({min: 0, max: 24}).withMessage("Sleep hours must be between 0 and 24"),
    body('water_intake').optional().isNumeric().withMessage("Water intake must be a valid number in ml")
    .custom(value => value >= 1 && value < 10000)  // rajaus 0-10000 ml (max 10 litraa)
    .withMessage("Water intake must be between 1 and 10000 ml"),
    body('steps').optional().isNumeric(),
    body('notes').optional().isLength({max: 1500}).escape(),
    validationErrorHandler,
    postEntry
  );

    //hakee yksittäisen merkinnän ID perusteella, päivittää merkinnän, poistaa merkinnän
    diaryRouter
    .route('/:id')
    .get(authenticateToken, getEntryById)
    .put(
      authenticateToken,
      body("entry_date").optional(),
      body("mood").optional().isLength({ min: 2, max: 50 }).trim().escape(),
      body('mood_intensity').optional().isInt({ min: 1, max: 5 }).withMessage('Mood intensity must be between 1 and 5'),
      body("weight").optional().isFloat({ min: 2, max: 200 }),
      body("sleep_hours").optional().isFloat({ min: 0, max: 24 }),
      body('water_intake').optional().isNumeric().withMessage("Water intake must be a valid number in ml")
      .custom(value => value >= 1 && value < 10000)  // rajaus 1-10000 ml (max 10 litraa)
      .withMessage("Water intake must be between 1 and 10000 ml"),
      body('steps').optional().isNumeric(),
      body("notes").optional().isLength({ max: 1500 }).trim().escape(),
      validationErrorHandler,
      putEntry)

    .delete(authenticateToken, deleteEntry);

  diaryRouter.get('/stats/sleep', authenticateToken, getSleepStats);
  diaryRouter.get('/stats/steps', authenticateToken, getStepsStats);
  diaryRouter.get('/stats/water', authenticateToken, getWaterStats);


  export default diaryRouter;


