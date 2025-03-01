import express from 'express';
import { body } from 'express-validator';
import { addMenstrualCycle, updateMenstrualCycle, getAverageCycleLength, getAllCycleLengths, getOvulationDates, getAllCycles } from '../controllers/cycle-contoller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handler.js';

const menstrualCycleRouter = express.Router();

// Lisää uusi kuukautiskierto
menstrualCycleRouter
  .route('/')
  .get(authenticateToken, getAllCycles)
  .post(
    authenticateToken,
    body('start_date').notEmpty().isDate().withMessage('Alkamispäivä pitää täyttää'),
    body('end_date').optional().isDate().withMessage('Loppumispäivä pitää olla päivämäärä'),
    body('symptoms').optional().isLength({ max: 500 }).trim().escape(),
    body('notes').optional().isLength({ max: 1500 }).trim().escape(),
    validationErrorHandler,
    addMenstrualCycle
  );

// Päivittää kuukautiskierron tiedot
menstrualCycleRouter
  .route('/:id')
  .put(
    authenticateToken,
    body('start_date').optional().isDate(),
    body('end_date').optional().isDate(),
    body('symptoms').optional().isLength({ max: 500 }).trim().escape(),
    body('notes').optional().isLength({ max: 1500 }).trim().escape(),
    validationErrorHandler,
    updateMenstrualCycle
  );

// Tilastot
menstrualCycleRouter.get('/stats/average-cycle-length', authenticateToken, getAverageCycleLength);
menstrualCycleRouter.get('/stats/cycle-lengths', authenticateToken, getAllCycleLengths);
menstrualCycleRouter.get('/stats/ovulation-dates', authenticateToken, getOvulationDates);


export default menstrualCycleRouter;
