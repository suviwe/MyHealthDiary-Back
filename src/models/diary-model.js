import promisePool from "../utils/database.js";

// Hakee käyttäjän merkinnät
/**
 *
 * @param {*} userId
 * @param {*} entryId
 * @returns
 */
const getEntriesForUser = async (userId, entryId = null) => {
  try {
    if (entryId) {
      // Haetaan tietty merkintä
      const [rows] = await promisePool.query(
        'SELECT * FROM DiaryEntries WHERE entry_id = ? AND user_id = ?',
        [entryId, userId]
      );
      return rows;
    } else {
      // Haetaan kaikki merkinnät käyttäjältä
      const [rows] = await promisePool.query(
        'SELECT * FROM DiaryEntries WHERE user_id = ?',
        [userId]
      );
      return rows;
    }
  } catch (error) {
    console.error('error', error.message);
    throw new Error('database error');
  }
};

/**
 *
 * @param {*} entry
 * @returns
 */
const addEntry = async (entry) => {
  const {user_id, entry_date, mood, mood_intensity, weight, sleep_hours, water_intake, steps, notes} = entry;
  const sql = `INSERT INTO DiaryEntries (user_id, entry_date, mood, mood_intensity, weight, sleep_hours, water_intake, steps, notes)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [user_id, entry_date, mood, mood_intensity, weight, sleep_hours, water_intake, steps, notes];
  try {
    const rows = await promisePool.query(sql, params);
    console.log('rows', rows);
    return {entry_id: rows[0].insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const updateEntry = async (id, entry) => {
  const { mood, mood_intensity, weight, sleep_hours, water_intake, steps, notes } = entry;

  const sql = `
    UPDATE DiaryEntries
    SET mood = ?, mood_intensity = ?, weight = ?, sleep_hours = ?, water_intake = ?, steps = ?, notes = ?
    WHERE entry_id = ?`;
/*const updateEntry = async (id, entry) => {
  const { mood, weight, sleep_hours, notes } = entry;
  const sql = `UPDATE DiaryEntries
               SET mood = ?, weight = ?, sleep_hours = ?, notes = ?
               WHERE entry_id = ?`;*/

  try {
    const rows = await promisePool.query(sql, [mood, mood_intensity, weight, sleep_hours, water_intake, steps, notes, id]);
    console.log('rows', rows);
    return { message: "Merkintä päivitetty!" };
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};


/**
 * Poistetaan merkintä entry_id perusteella vain, jos käyttäjä omistaa sen.
 * @param {number} entryId - Poistettavan merkinnän ID
 * @param {number} userId - Kirjautuneen käyttäjän ID (tokenista)
 * @returns {object} - Viesti poistamisen onnistumisesta tai virheestä
 */
const deleteEntryById = async (entryId, userId) => {
  try {
    // 1. Tarkistetaan, kuuluuko merkintä käyttäjälle
    const [entry] = await promisePool.query(
      "SELECT user_id FROM DiaryEntries WHERE entry_id = ?",
      [entryId]
    );

    if (entry.length === 0) {
      return { error: "Entry not found" }; // Merkintää ei löydy
    }

    if (entry[0].user_id !== userId) {
      return { error: "Forbidden: You can only delete your own entries" }; // Käyttäjä ei omista merkintää
    }

    // 2. Poistetaan merkintä, jos omistajuus täsmää
    await promisePool.query("DELETE FROM DiaryEntries WHERE entry_id = ?", [entryId]);

    return { message: "Merkintä poistettu!" };
  } catch (e) {
    console.error("error deleteEntry:", e.message);
    return { error: e.message };
  }
};

//koodeja tilastojen hauille:

/**
 *Haetaan käyttäjän keskiarvoinen unen määrä
 * @param {*} userId
 * @returns
 */
const fetchSleepStats = async (userId) => {
  try {
    const [sleepAvg] = await promisePool.query(
      'SELECT AVG(sleep_hours) AS avg_sleep FROM DiaryEntries WHERE user_id = ? AND entry_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)', // Haetaan vain 30 viime päivän data
      [userId]
    );

    return {
      avg_sleep: sleepAvg[0]?.avg_sleep || 0  // Jos ei löydy dataa, palautetaan 0
    };
  } catch (error) {
    console.error("Error fetching sleep stats:", error);
    return { error: "Database error" };
  }
};

const fetchStepsStats = async (userId) => {
  try {
    const [stepsAvg] = await promisePool.query(
      'SELECT AVG(steps) AS avg_steps FROM DiaryEntries WHERE user_id = ? AND entry_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)',
      [userId]
    );

    return {
      avg_steps: stepsAvg[0]?.avg_steps || 0  // Jos ei löydy dataa, palautetaan 0
    };
  } catch (error) {
    console.error("Error fetching steps stats:", error);
    return { error: "Database error" };
  }
};

const fetchWaterStats = async (userId) => {
  try {
    const [waterAvg] = await promisePool.query(
      'SELECT AVG(water_intake) AS avg_water FROM DiaryEntries WHERE user_id = ? AND entry_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)',
      [userId]
    );

    return {
      avg_water: waterAvg[0]?.avg_water || 0  // Jos ei löydy dataa, palautetaan 0
    };
  } catch (error) {
    console.error("Error fetching water stats:", error);
    return { error: "Database error" };
  }
};



export { getEntriesForUser, addEntry, updateEntry, deleteEntryById, fetchSleepStats, fetchStepsStats, fetchWaterStats};
