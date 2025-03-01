import express from 'express';
import { body } from 'express-validator';
import { getActivityLogsByUserId, addActivityLog, updateActivityLog, deleteActivityLog } from '../controllers/activity-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handler.js';


const activityRouter = express.Router();

// Reitti, joka palauttaa käyttäjän kaikki aktiivisuusmerkinnät
activityRouter
  .route('/')
  .get(authenticateToken, getActivityLogsByUserId) // Hakee kaikki aktiivisuusmerkinnät
  .post(
    authenticateToken,
    body('activity_type').notEmpty().isString().isLength({ min: 3, max: 150 }).trim().escape(),
    body('duration_minutes').notEmpty().isInt().withMessage('Keston pitää olla kokonaisluku'),
    body('calories_burned').isDecimal({ min: 0 }).withMessage('Kalorit pitää olla validi numero'),
    body('intensity').optional().isString().isLength({ max: 50 }).trim().escape(),
    body('notes').optional().isLength({ max: 500 }).trim(),
    validationErrorHandler,
    addActivityLog // Lisää uuden aktiivisuusmerkinnän
  );

// Reitti, joka käsittelee yksittäisiä aktiivisuusmerkintöjä
activityRouter
  .route('/:id')
  .get(authenticateToken, getActivityLogsByUserId) // Hakee yksittäisen aktiivisuusmerkinnän
  .put(
    authenticateToken,
    body('activity_type').optional().isString(),
    body('duration_minutes').optional().isInt().withMessage('Pitää olla positiivinen kokonaisluku'),
    body('calories_burned').optional().isDecimal({ min: 0 }),
    body('intensity').optional().isString(),
    body('notes').optional().isLength({ max: 500 }).trim(),
    validationErrorHandler,
    updateActivityLog // Päivittää aktiivisuusmerkinnän
  )

  .delete(authenticateToken, deleteActivityLog); // Poistaa aktiivisuusmerkinnän

export default activityRouter;
