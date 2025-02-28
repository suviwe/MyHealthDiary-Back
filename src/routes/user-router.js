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
userRouter
  .route('/')
  // only logged in user can fetch the user list
  //vain kirjautuneet käyttäjät voi käyttää, saadaan token
  //.get(authenticateToken, getUsers)

  //body funktio on middleware. isAlphaNumeric tarkoittaa että ei saa olla mitään erikoismerkkejä
  .post(
    body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
    body('password').trim().isLength({min: 3, max: 120}),
    body('email').trim().isEmail(),
    validationErrorHandler,
    registerUser
  );

//all routes to /api/users/:id
userRouter
  .route('/:id')
  //.get(findUserById)
  .put(
    authenticateToken,
    body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
    body('password').trim().isLength({min: 3, max: 120}),
    body('email').trim().isEmail(),
    validationErrorHandler,
    editUser
  )
  .delete(deleteUser);

  userRouter.route('/login')
  .post(userLogin);

  userRouter.route('/me')
  .get(authenticateToken, getMe);


export default userRouter;
