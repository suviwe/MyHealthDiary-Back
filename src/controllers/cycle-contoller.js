import { insertMenstrualCycle, modifyMenstrualCycle, fetchAverageCycleLength, fetchAverageMenstruationLength,  fetchOvulationDate, findMenstrualCyclesByUserId } from "../models/cycle-model.js";
import { customError } from "../middlewares/error-handler.js"; // custom error for consistent error handling

/**
 * Lisää uuden kuukautiskierron
 */
const addMenstrualCycle = async (req, res, next) => {
  try {
    const { start_date, end_date, ovulation_date, symptoms, notes } = req.body;
    const userId = req.user.user_id;

    if (!start_date) {
      return next(customError("Start date is required", 400)); // custom error handling
    }

    // Laske kierron pituus (cycle_length) start_date ja end_date perusteella
    const cycleLength = end_date ? Math.floor((new Date(end_date) - new Date(start_date)) / (1000 * 3600 * 24)) : null;

    const newCycle = {
      user_id: userId,
      start_date,
      end_date,
      cycle_length: cycleLength,
      ovulation_date,
      symptoms,
      notes
    };

    const result = await insertMenstrualCycle(newCycle);
    res.status(201).json({ message: "Menstrual cycle added", cycle_id: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Päivittää kuukautiskierron tiedot
 */
const updateMenstrualCycle = async (req, res, next) => {
  try {
    const userIdFromToken = req.user.user_id;
    const cycleId = req.params.id;
    const { start_date, end_date, ovulation_date, symptoms, notes } = req.body;

    const updatedFields = { start_date, end_date, ovulation_date, symptoms, notes };

    // Laske kierron pituus (cycle_length) uudelleen, jos end_date on annettu
    if (end_date) {
      const cycleLength = Math.floor((new Date(end_date) - new Date(start_date)) / (1000 * 3600 * 24));
      updatedFields.cycle_length = cycleLength;
    }

    const result = await modifyMenstrualCycle(userIdFromToken, cycleId, updatedFields);

    if (!result) {
      return next(customError("Cycle not found or update failed", 404)); // custom error handling
    }

    res.status(200).json({ message: "Menstrual cycle updated" });
  } catch (error) {
    next(error);
  }
};

/**
 * Hakee keskimääräisen kierron pituuden
 */
const getTrueAverageCycleLength = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const stats = await fetchAverageCycleLength(userId);

    if (stats.error) {
      return next(customError(stats.error, 500)); // custom error handling
    }
    console.log("Backend paluttaa keskimääräisen kierron pituuden:", stats);

    res.status(200).json({
      message: `Keskimääräinen kierto  ${parseFloat(stats.avg_cycle_length).toFixed(1)} päivää.`,
      avg_cycle_length: parseFloat(stats.avg_cycle_length).toFixed(1)
    });
  } catch (error) {
    next(error);
  }
};


//keston pituus
const getAverageMenstruationLength  = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const stats = await fetchAverageMenstruationLength(userId); //

    if (stats.error) {
      return next(customError(stats.error, 500));
    }

    res.status(200).json({
      message: `Keskimääräinen kuukautisten kesto on ${parseFloat(stats.avg_menstruation_length).toFixed(1)} päivää.`,
      avg_menstruation_length: parseFloat(stats.avg_menstruation_length).toFixed(1)
    });
  } catch (error) {
    next(error);
  }
};





/*const getAllCycleLengths = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const cycles = await fetchCycleLengths(userId);

    if (cycles.error) {
      return next(customError(cycles.error, 500)); // custom error handling
    }

    res.status(200).json(cycles);
  } catch (error) {
    next(error);
  }
};*/

/*
 * Hakee kaikki kuukautiskierron merkinnät
 */
const getAllCycles = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const cycles = await findMenstrualCyclesByUserId(userId);

    if (!cycles || cycles.length === 0) {
      return next(customError("No menstrual cycles found", 404)); // custom error handling
    }

    res.status(200).json(cycles); // Palautetaan kaikki kierron tiedot
  } catch (error) {
    next(error);
  }
};

/**
 * Hakee ovulaatiopäivät kaikille kuukautiskierron merkinnöille
 */
const getOvulationDates = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const ovulationDates = await fetchOvulationDate(userId);

    if (ovulationDates.error) {
      return next(customError(ovulationDates.error, 500)); // custom error handling
    }

    res.status(200).json(ovulationDates);
  } catch (error) {
    next(error);
  }
};

export {
  getAverageMenstruationLength,
  getTrueAverageCycleLength,
  getOvulationDates,
  addMenstrualCycle,
  updateMenstrualCycle,
  getAllCycles
};
