import express from 'express';
import { body } from 'express-validator';
import { addMenstrualCycle, updateMenstrualCycle, getAverageMenstruationLength, getTrueAverageCycleLength, getOvulationDates, getAllCycles } from '../controllers/cycle-contoller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handler.js';

const menstrualCycleRouter = express.Router();

// Lisää uusi kuukautiskierto


/**
 * @api {post} /api/cycle Lisää kuukautiskierron merkintä
 * @apiName AddMenstrualCycle
 * @apiGroup Kuukautiskierto
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiBody {String} start_date Alkamispäivämäärä (YYYY-MM-DD) (pakollinen).
 * @apiBody {String} [end_date] Päättymispäivämäärä (YYYY-MM-DD).
 * @apiBody {String} [symptoms] Oireet (max 500 merkkiä).
 * @apiBody {String} [notes] Muistiinpanot (max 1500 merkkiä).
 *
 * @apiSuccess {String} message Vahvistusviesti.
 * @apiSuccess {Number} cycle_id Lisätyn kierron ID.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "message": "Menstrual cycle added",
 *       "cycle_id": 19
 *     }
 *
 * @apiError BadRequest Jos alkamispäivämäärä puuttuu tai on virheellinen.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Start date is required"
 *     }
 */
/**
 * @api {get} /api/cycle Hae kaikki kuukautiskierron merkinnät
 * @apiName GetAllCycles
 * @apiGroup Kuukautiskierto
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Object[]} cycles Lista käyttäjän kuukautiskierron merkinnöistä.
 * @apiSuccess {Number} cycles.cycle_id Merkinnän ID.
 * @apiSuccess {String} cycles.start_date Alkamispäivämäärä.
 * @apiSuccess {String} cycles.end_date Päättymispäivämäärä (jos tiedossa).
 * @apiSuccess {Number} cycles.cycle_length Kierron pituus päivinä (jos tiedossa).
 * @apiSuccess {String} [cycles.symptoms] Oireet.
 * @apiSuccess {String} [cycles.notes] Muistiinpanot.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
  *         "cycle_id": 19,
          "user_id": 15,
          "start_date": "2025-03-06T22:00:00.000Z",
          "end_date": "2025-03-11T22:00:00.000Z",
          "cycle_length": 5,
          "ovulation_date": null,
          "symptoms": "vatsakipu",
          "notes": "",
          "created_at": "2025-03-07T09:01:00.000Z"
  *      }
 *     ]
 *
 * @apiError NotFound Jos käyttäjällä ei ole merkintöjä.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No menstrual cycles found"
 *     }
 */

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


/**
 * @api {put} /api/cycle/:id Päivitä kuukautiskierron merkintä
 * @apiName UpdateMenstrualCycle
 * @apiGroup Kuukautiskierto
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Muokattavan merkinnän ID.
 *
 * @apiBody {String} [start_date] Alkamispäivämäärä (YYYY-MM-DD).
 * @apiBody {String} [end_date] Päättymispäivämäärä (YYYY-MM-DD).
 * @apiBody {String} [symptoms] Oireet (max 500 merkkiä).
 * @apiBody {String} [notes] Muistiinpanot (max 1500 merkkiä).
 *
 * @apiSuccess {String} message Vahvistusviesti.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Menstrual cycle updated"
 *     }
 *
 * @apiError NotFound Jos merkintää ei löydy tai päivitys epäonnistuu.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Cycle not found or update failed"
 *     }
 */

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


/**
 * @api {get} /api/cycle/stats/average-menstruation-length Hae keskimääräinen kuukautisten kesto
 * @apiName GetAverageMenstruationLength
 * @apiGroup Kuukautiskierto
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {String} message Keskimääräinen kuukautisten kesto päivinä.
 * @apiSuccess {Number} avg_cycle_length Keskimääräinen kuukautisten kesto päivinä.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Keskimääräinen kuukautisten kesto on 4.4 päivää.",
 *       "avg_cycle_length": 4.4
 *     }
 *
 * @apiError NotFound Jos tilastotietoja ei löydy.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No menstruation data found"
 *     }
 */
menstrualCycleRouter.get('/stats/average-menstruation-length', authenticateToken, getAverageMenstruationLength);



/**
 * @api {get} /api/cycle/stats/average-cycle-length Hae keskimääräinen kierron pituus
 * @apiName GetTrueAverageCycleLength
 * @apiGroup Kuukautiskierto
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {String} message Keskimääräinen kierron pituus päivinä.
 * @apiSuccess {Number} avg_cycle_length Keskimääräinen kierron pituus päivinä.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Keskimääräinen kierron pituus on 27.1 päivää.",
 *       "avg_cycle_length": 27.1
 *     }
 *
 * @apiError NotFound Jos tilastotietoja ei löydy.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No cycle data found"
 *     }
 */
menstrualCycleRouter.get('/stats/average-cycle-length', authenticateToken, getTrueAverageCycleLength);
//menstrualCycleRouter.get('/stats/cycle-lengths', authenticateToken, getAllCycleLengths);
menstrualCycleRouter.get('/stats/ovulation-dates', authenticateToken, getOvulationDates);


export default menstrualCycleRouter;
