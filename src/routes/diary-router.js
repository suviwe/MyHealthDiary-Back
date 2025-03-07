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

/**
  * @api {get} /api/diary Hae käyttäjän päiväkirjamerkinnät
  * @apiName GetEntries
  * @apiGroup Päiväkirja
  * @apiPermission token
  *
  * @apiHeader {String} Authorization Bearer token.
  *
  * @apiSuccess {Object[]} entries Lista käyttäjän merkinnöistä.
  * @apiSuccess {Number} entries.entry_id Merkinnän ID.
  * @apiSuccess {Number} entries.user_id Käyttäjän ID.
  * @apiSuccess {String} entries.entry_date Päivämäärä (YYYY-MM-DD).
  * @apiSuccess {String} entries.mood Mieliala.
  * @apiSuccess {Number} entries.mood_intensity Mielialan intensiteetti (1-5).
  * @apiSuccess {Number} entries.weight Paino (kg).
  * @apiSuccess {Number} entries.sleep_hours Nukutut tunnit.
  * @apiSuccess {Number} entries.water_intake Juotu vesi (ml).
  * @apiSuccess {Number} entries.steps Otetut askeleet.
  * @apiSuccess {String} entries.notes Muistiinpanot.
  * @apiSuccess {String} entries.created_at Merkinnän luontiaika.
  *
  * @apiSuccessExample {json} Response-Example:
  *     HTTP/1.1 200 OK
  *     [
  *       {
  *         "entry_id": 60,
  *         "user_id": 15,
  *         "entry_date": "2025-03-06",
  *         "mood": "ihan hyvä",
  *         "mood_intensity": 3,
  *         "weight": "554.00",
  *         "sleep_hours": 7,
  *         "water_intake": 1000,
  *         "steps": 10050,
  *         "notes": "projektin tekoa",
  *         "created_at": "2025-03-07T08:12:34.000Z"
  *       }
  *     ]
  *
  * @apiError NoEntries Käyttäjällä ei ole merkintöjä.
  * @apiErrorExample {json} Error-Response:
  *     HTTP/1.1 404 Not Found
  *     {
  *       "message": "Ei merkintöjä löytynyt"
  *     }
  *
  */

/**
 * @api {post} /api/diary Lisää uusi päiväkirjamerkintä
 * @apiName PostEntry
 * @apiGroup Päiväkirja
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiBody {String} entry_date Päivämäärä (pakollinen, YYYY-MM-DD).
 * @apiBody {String} [mood] Mieliala (valinnainen, max 50 merkkiä).
 * @apiBody {Number} mood_intensity Mielialan voimakkuus (1-5, pakollinen).
 * @apiBody {Number} [weight] Paino (kg, valinnainen, numero).
 * @apiBody {Number} [sleep_hours] Unen määrä (0-24 tuntia, valinnainen).
 * @apiBody {Number} [water_intake] Juotu vesi (ml, valinnainen, max 10 litraa).
 * @apiBody {Number} [steps] Otetut askeleet (valinnainen, numero).
 * @apiBody {String} [notes] Muistiinpanot (max 1500 merkkiä, valinnainen).
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "entry_date": "2025-03-07",
 *       "mood": "ihan hyvä",
 *       "mood_intensity": 3,
 *       "weight": 55,
 *       "sleep_hours": 8,
 *       "water_intake": 1500,
 *       "steps": 10000,
 *       "notes": "Hyvä päivä."
 *     }
 *
 * @apiSuccess {String} message "Entry added."
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "message": "Entry added."
 *     }
 *
 * @apiError ValidationError Jos jokin pakollinen kenttä puuttuu tai virheellinen.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Mood intensity must be between 1 and 5"
 *     }
 */

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

   /**
 * @api {put} /api/diary/:id Muokkaa päiväkirjamerkintää
 * @apiName PutEntry
 * @apiGroup Päiväkirja
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Merkinnän ID, joka muokataan.
 *
 * @apiBody {String} [entry_date] Päivämäärä (YYYY-MM-DD, valinnainen).
 * @apiBody {String} [mood] Mieliala (max 50 merkkiä, valinnainen).
 * @apiBody {Number} [mood_intensity] Mielialan voimakkuus (1-5, valinnainen).
 * @apiBody {Number} [weight] Paino (kg, valinnainen, numero).
 * @apiBody {Number} [sleep_hours] Unen määrä (0-24 tuntia, valinnainen).
 * @apiBody {Number} [water_intake] Juotu vesi (ml, valinnainen, max 10 litraa).
 * @apiBody {Number} [steps] Otetut askeleet (valinnainen, numero).
 * @apiBody {String} [notes] Muistiinpanot (max 1500 merkkiä, valinnainen).
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "mood": "Parempi päivä",
 *       "mood_intensity": 4,
 *       "sleep_hours": 8,
 *       "notes": "Nukuin hyvin ja olo on energinen."
 *     }
 *
 * @apiSuccess {String} message "merkintä päivitetty."
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "merkintä päivitetty"
 *     }
 *
 * @apiError NotFound Jos merkintää ei löydy tai käyttäjällä ei ole oikeuksia muokata sitä.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Entry not found or update failed"
 *     }
 */
/**
 * @api {delete} /api/diary/:id Poista päiväkirjamerkintä
 * @apiName DeleteEntry
 * @apiGroup Päiväkirja
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Number} id Merkinnän uniikki ID, joka poistetaan.
 *
 * @apiParamExample {json} Request-Example:
 *     DELETE /api/diary/25
 *
 * @apiSuccess {String} message "Merkintä poistettu onnistuneesti."
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Merkintä poistettu onnistuneesti."
 *     }
 *
 * @apiError NotFound Jos merkintää ei löydy tai käyttäjällä ei ole oikeuksia poistaa sitä.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Merkintää ei löytynyt tai sinulla ei ole oikeuksia poistaa sitä."
 *     }
 */

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
/**
 * @api {get} /api/diary/stats/sleep Hae uni-tilastot
 * @apiName GetSleepStats
 * @apiGroup Tilastot
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {String} message Keskimääräinen unen määrä
 * @apiSuccess {Number} avg_sleep Keskimääräinen unen määrä.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Uni tilastosi mukaan nukut keskimäärin 7.5 tuntia per yö.",
 *       "avg_sleep": 7.5
 *     }
 *
 * @apiError Unauthorized Jos käyttäjä ei ole kirjautunut sisään.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized"
 *     }
 */

  diaryRouter.get('/stats/sleep', authenticateToken, getSleepStats);

/**
 * @api {get} /api/diary/stats/steps Hae askeltilastot
 * @apiName GetStepsStats
 * @apiGroup Tilastot
 * @apiPermission token
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {String} message Keskimääräinen päivittäinen askelmäärä.
 * @apiSuccess {Number} avg_steps Keskimääräiset askeleet.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Askeleet tilastosi mukaan kuljet keskimäärin 8500 askelta per päivä.",
 *       "avg_steps": 8500
 *     }
 *
 * @apiError Unauthorized Jos käyttäjä ei ole kirjautunut sisään.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized"
 *     }
 */

  diaryRouter.get('/stats/steps', authenticateToken, getStepsStats);
  diaryRouter.get('/stats/water', authenticateToken, getWaterStats);


  export default diaryRouter;


