import express from 'express';
import {body} from 'express-validator';

import {
  registerUser,
  userLogin,
  deleteUser,
  editUser,
  getMe,
} from '../controllers/user-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handler.js';

const userRouter = express.Router();

//all routers to /api/users

/**
 * @api {post} /users Rekisteröidy
 * @apiName RegisterUser
 * @apiGroup Käyttäjät
 * @apiPermission All
 *
 * @apiBody {String{6-20}} username Käyttäjänimi (vain kirjaimia ja numeroita)
 * @apiBody {String{8-50}} password Salasana (vähintään yksi iso kirjain, pieni kirjain, numero tai erikoismerkki)
 * @apiBody {String} email Sähköposti (validi sähköpostiosoite)
 *
 * @apiSuccess {String} message Ilmoitus onnistuneesta rekisteröitymisestä.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "message": "Käyttäjä on lisätty, id: 28"
 *     }
 *
 * @apiError BadRequest Virheellinen syöte.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Virheellinen käyttäjänimi tai salasana"
 *     }
 */
userRouter
  .route('/')
  // only logged in user can fetch the user list
  //vain kirjautuneet käyttäjät voi käyttää, saadaan token
  //.get(authenticateToken, getUsers)

  //body funktio on middleware. isAlphaNumeric tarkoittaa että ei saa olla mitään erikoismerkkejä
  .post(
    body('username').trim().isLength({min: 6, max: 20}).isAlphanumeric(),
    body('password').trim().isLength({min: 8, max: 50}).matches(/^(?=.*[a-zåäö])(?=.*[A-ZÅÄÖ])(?=.*[\d!@#$%^&*(),.?":{}|<>]).+$/)
    .withMessage('Salasana täytyy sisältää vähintään yksi iso ja pieni kirjain, sekä joko numero tai erikoismerkki'),
    body('email').trim().isEmail(),
    validationErrorHandler,
    registerUser
  );

//all routes to /users/:id
userRouter
  .route('/:id')
  //.get(findUserById)
  .put(
    authenticateToken,
    body('username').trim().isLength({min: 6, max: 20}).isAlphanumeric(),
    body('password').trim().isLength({min: 8, max: 50}).matches(/^(?=.*[a-zåäö])(?=.*[A-ZÅÄÖ])(?=.*[\d!@#$%^&*(),.?":{}|<>]).+$/)
    .withMessage('Salasana täytyy sisältää vähintään yksi iso ja pieni kirjain, sekä joko numero tai erikoismerkki'),
    body('email').trim().isEmail(),
    validationErrorHandler,
    editUser
  )
  .delete(deleteUser);



/**
 * @api {post} /users/login Kirjaudu sisään
 * @apiName UserLogin
 * @apiGroup Käyttäjät
 * @apiPermission All
 *
 * @apiBody {String} username Käyttäjänimi.
 * @apiBody {String} password Salasana.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "username": "kayttaja123",
 *       "password": "Salasana123!"
 *     }
 *
 * @apiSuccess {String} message Viesti onnistuneesta kirjautumisesta.
 * @apiSuccess {String} token JWT-autentikointitoken.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Käyttäjä löytyy ja tiedot ovat oikein",
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *     }
 *
 * @apiError Unauthorized Väärä käyttäjätunnus tai salasana.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Bad username/password"
 *     }
 */
  userRouter.route('/login')
  .post(userLogin);

  userRouter.route('/me')
  .get(authenticateToken, getMe);


export default userRouter;
