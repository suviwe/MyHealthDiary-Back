import {
  findActivityLogsByUserId,
  insertActivityLog,
  modifyActivityLog,
  removeActivityLog
} from "../models/activity-model.js";

/**
 * Hakee kirjautuneen käyttäjän kaikki aktiivisuusmerkinnät
 */
const getActivityLogsByUserId = async (req, res, next) => {
  try {
    const userId = req.user.user_id; // Haetaan käyttäjä ID tokenista
    const activityLogs = await findActivityLogsByUserId(userId);

    if (!activityLogs || activityLogs.length === 0) {
      return next({ message: "Ei aktiivisuusmerkintöjä löytynyt", status: 404 });
    }

    res.status(200).json(activityLogs);
  } catch (error) {
    next(error); // Virhe menee error handleriin
  }
};

/**
 * Lisää aktiivisuusmerkinnän kirjautuneelle käyttäjälle
 */
const addActivityLog = async (req, res, next) => {
  try {
    const { activity_type, duration_minutes, calories_burned, intensity, notes } = req.body;
    const userId = req.user.user_id;

    // Tarkistetaan, että pakolliset kentät ovat täytetty
    if (!activity_type || !duration_minutes) {
      return next({ message: "Täytä kaikki vaadittavat kentät: activity_type ja duration_minutes", status: 400 });
    }

    const newActivityLog = {
      user_id: userId,
      activity_type,
      duration_minutes,
      calories_burned,
      intensity,
      notes
    };

    const result = await insertActivityLog(newActivityLog);

    res.status(201).json({ message: "Aktiivisuusmerkintä lisätty", log_id: result });
  } catch (error) {
    next(error); // Virhe menee error handleriin
  }
};

/**
 * Päivittää käyttäjän oman aktiivisuusmerkinnän
 */
const updateActivityLog = async (req, res, next) => {
  try {
    const userIdFromToken = req.user.user_id; // Haetaan käyttäjän ID tokenista
    const activityLogId = req.params.id; // Haetaan merkinnän ID parametreista
    const { activity_type, duration_minutes, calories_burned, intensity, notes } = req.body;

    const updatedFields = {
      activity_type,
      duration_minutes,
      calories_burned,
      intensity,
      notes
    };

    const result = await modifyActivityLog(userIdFromToken, activityLogId, updatedFields);

    if (result.error) {
      return next({ message: "Aktiivisuusmerkintä ei löytynyt tai päivitys epäonnistui", status: 404 });
    }

    res.status(200).json({ message: "Aktiivisuusmerkintä päivitetty" });
  } catch (error) {
    next(error); // Virhe menee error handleriin
  }
};

/**
 * Poistaa käyttäjän oman aktiivisuusmerkinnän
 */
const deleteActivityLog = async (req, res, next) => {
  try {
    const userIdFromToken = req.user.user_id; // Haetaan käyttäjän ID tokenista
    const activityLogId = req.params.id; // Haetaan merkinnän ID parametreista

    const result = await removeActivityLog(userIdFromToken, activityLogId);

    if (result.error) {
      return next({ message: "Aktiivisuusmerkintä ei löytynyt tai poisto epäonnistui", status: 404 });
    }

    res.status(200).json({ message: "Aktiivisuusmerkintä poistettu" });
  } catch (error) {
    next(error); // Virhe menee error handleriin
  }
};

export {getActivityLogsByUserId, addActivityLog, updateActivityLog, deleteActivityLog};
