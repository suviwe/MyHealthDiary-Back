import { customError } from "../middlewares/error-handler.js";
import { getEntriesForUser, addEntry, updateEntry, deleteEntryById, fetchSleepStats, fetchWaterStats, fetchStepsStats } from "../models/diary-model.js";



const getEntries = async (req, res, next) => {
  try {
    const user_id = req.user.user_id; // Haetaan käyttäjä-ID tokenista
    console.log("Käyttäjä hakee merkintöjään:", user_id);

    const result = await getEntriesForUser(user_id); // Haetaan käyttäjän merkinnät modelista

    if (result && result.length > 0) {
      res.json(result); // Palautetaan merkinnät
    } else {
      res.status(404).json({ message: "Ei merkintöjä löytynyt" }); // Jos ei löydy merkintöjä
    }
  } catch (error) {
    next(error); // Virhe menee error handleriin
  }
};

const getEntryById = async (req, res, next) => {
  try {
    const entryId = req.params.id; // Haetaan merkinnän ID
    const userId = req.user.user_id; // Haetaan käyttäjä-ID tokenista

    const entry = await getEntriesForUser(userId, entryId); // Haetaan merkintä käyttäjältä

    if (entry && entry.length > 0) {
      res.json(entry[0]); // Palautetaan merkintä
    } else {
      next({ message: "Entry not found", status: 404 }); // Jos merkintää ei löydy
    }
  } catch (error) {
    next(error); // Virhe menee error handleriin
  }
};


const postEntry = async (req, res, next) => {
  //
  const newEntry = req.body;
  newEntry.user_id = req.user.user_id;
  try {
    await addEntry(newEntry);
    res.status(201).json({message: "Entry added."});
  } catch (error) {
    next(error);
  }
};


const putEntry = async (req, res, next) => {
  try {
    const result = await updateEntry(req.params.id, req.body);

    if (result) {
      res.status(200).json(result);
    } else {
      return next({ message: "Entry not found or update failed", status: 404 });
    }
  } catch (error) {
    next(error);
  }
};

const deleteEntry = async (req, res, next) => {
  try {
    const entryId = req.params.id;
    const userId = req.user.user_id; // Haetaan käyttäjän ID tokenista

    console.log("Poistetaan merkintä ID:", entryId, "Käyttäjä ID:", userId);

    // Tarkistetaan ensin, kuuluuko merkintä käyttäjälle
    const result = await deleteEntryById(entryId, userId);

    if (!result) {
      return next({ message: "Entry not found or not authorized to delete", status: 404 });
    }

    res.status(200).json({ message: "merkintä poistettu onnistuneesti" });
  } catch (error) {
    next(error);
  }
};

const getSleepStats = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const stats = await fetchSleepStats(userId);

    if (stats.error) {
      return next(customError(stats.error));
    }

    res.status(200).json({
      message: `Uni tilastosi mukaan nukut keskimäärin ${parseFloat(stats.avg_sleep).toFixed(1)} tuntia per yö.`,
      avg_sleep: parseFloat(stats.avg_sleep).toFixed(1)
    });
  } catch (error) {
    next(error);
    
  }
};

const getStepsStats = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const stats = await fetchStepsStats(userId);

    if (stats.error) {
      return next(customError(stats.error));
    }

    res.status(200).json({
      message: `Askeleet tilastosi mukaan kuljet keskimäärin ${parseFloat(stats.avg_steps).toFixed(1)} askelta per päivä.`,
      avg_steps: parseFloat(stats.avg_steps).toFixed(1)
    });
  } catch (error) {
    next(error);
  }
};

const getWaterStats = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const stats = await fetchWaterStats(userId);

    if (stats.error) {
      return next(customError(stats.error));
    }

    res.status(200).json({
      message: `Vedenkulutus tilastosi mukaan juot keskimäärin ${parseFloat(stats.avg_water).toFixed(1)} litraa vettä per päivä.`,
      avg_water: parseFloat(stats.avg_water).toFixed(1)
    });
  } catch (error) {
    next(error);
  }
};



export {getEntries, getEntryById, postEntry, putEntry, deleteEntry, getSleepStats, getStepsStats, getWaterStats};

