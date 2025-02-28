import { insertUser, selectUserByUserName, selectUserById, deleteUserById, updateUserById} from '../models/user-model.js';
import bcrypt from 'bcryptjs';
import { customError } from '../middlewares/error-handler.js';
import 'dotenv/config';
import jwt from 'jsonwebtoken';





//lisää käyttäjä
const registerUser = async (req, res, next) => {
  console.log('registerUser request body:', req.body);

  const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const newUser = {
      //id: users.length + 1,
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email
    };
    try {
      const result = await insertUser(newUser)
      res.status(201);
      return res.json({message: 'Käyttäjä on lisätty, id: ' + result});
    } catch (error) {
      return next(customError(error.message, 400));
    }
  };


//user authentication
// jos käyttäjä löytyy tietokannasta verrataan kirjautumiseen syötettyä sanaa tietokannan
// salasanatiivisteeseen
const userLogin = async (req, res, next) => {

  console.log('userLogin:',  req.body)
  const username = req.body.username;
  const password = req.body.password;

  //jos username tai password puuttuu, tulee viesti
  if (!username || !password) {
    return next(customError('username missing', 400));
  }

  const user = await selectUserByUserName(username);

  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN,});
      console.log('user is found', user);
      return res.json({message: 'Käyttäjä löytyy ja tiedot ovat oikein', user, token});

    }
  }
    next (customError('Bad username/password', 401));
};

const getMe = async (req, res, next) => {
  try {
    const user = await selectUserById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ message: 'Käyttäjää ei löydy' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Userin tietojen muokkaus id:n perusteella. vain sisäänkirjautunut voi muokata omia tietojaan
  const editUser = async (req, res, next) => {
    console.log('editUser request body', req.body);

    const userIdFromToken = req.user.user_id; // Haetaan käyttäjän ID tokenista
    const userIdFromParams = parseInt(req.params.id); // Haetaan päivitettävän käyttäjän ID

    console.log("Token user ID:", userIdFromToken, "Requested ID:", userIdFromParams);

    //Varmistetaan, että käyttäjä voi muokata vain omaa profiiliaan
    if (userIdFromToken !== userIdFromParams) {
      return res.status(403).json({ message: 'ERROR: voit muokata vain oman profiilisi tietoja' });
    }

    try {
      //Haetaan päivitettävät tiedot
      const { username, email, password } = req.body;
      let updateFields = {username, email};

      //jos vaihdetaan salasana, se hashataan
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(password, salt);
      }

      //Päivitetään tiedot tietokantaan
      const result = await updateUserById(userIdFromParams, updateFields);

      if (result.error) {
        return res.status(400).json({ message: result.error });
      }

      res.status(200).json({ message: 'käyttäjätiedot päivitetty onnistuneesti' });

    } catch (error) {
      console.error('Error käyttäjän päivityksessä:', error);
      //res.status(500).json({ message: 'Database error' });
      next(customError('Database error: käyttäjätietojen päivitys epäonnistui', 500));
    }
  };

  const deleteUser = async (req, res, next) => {
    console.log('deleteUser request:', req.params.id);

    const userIdFromToken = req.user.user_id; // Haetaan käyttäjän ID tokenista
    const userIdFromParams = parseInt(req.params.id); // Haetaan poistettavan käyttäjän ID

    console.log("Token user ID:", userIdFromToken, "Requested ID:", userIdFromParams);

    // Varmistetaan, että käyttäjä voi poistaa vain oman profiilinsa
    if (userIdFromToken !== userIdFromParams) {
      return res.status(403).json({ message: 'ERROR: voit poistaa vain oman profiilisi' });
    }

    try {
      const result = await deleteUserById(userIdFromParams); // Kutsutaan modelia

      if (result.error) {
        return res.status(400).json({ message: result.error });
      }

      res.status(200).json({ message: 'Käyttäjätili poistettu onnistuneesti' });

    } catch (error) {
      console.error('Virhe käyttäjätilin poistamisessa:', error);
      next(customError('Database error: käyttäjätilin poistaminen epäonnistui', 500));
    }
  };




export {registerUser, userLogin, getMe, editUser, deleteUser};




