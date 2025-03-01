import promisePool from "../utils/database.js";


/**
 * Hakee kaikki aktiivisuustiedot käyttäjän ID:n perusteella
 * @param {number} user_id - Käyttäjän ID
 * @returns {Array} Käyttäjän kaikki aktiviteetit
 */
const findActivityLogsByUserId = async (user_id) => {
  try {
    const [rows] = await promisePool.query(
      "SELECT * FROM ActivityLogs WHERE user_id = ?",
      [user_id]
    );
    return rows;
  } catch (error) {
    console.error("Virhe findActivityLogsByUserId:", error.message);
    return { error: error.message };
  }
};

/**
 * Lisää aktiivisuusmerkinnän tietokantaan
 */
const insertActivityLog = async (activity) => {
  try {
    const [result] = await promisePool.query(
      "INSERT INTO ActivityLogs (user_id, activity_type, duration_minutes, calories_burned, intensity, notes) VALUES (?, ?, ?, ?, ?, ?)",
      [
        activity.user_id,
        activity.activity_type,
        activity.duration_minutes,
        activity.calories_burned,
        activity.intensity,
        activity.notes
      ]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error inserting activity log:", error);
    return { error: "Database error" };
  }
};

/**
 * Päivittää aktiivisuusmerkinnän, mutta vain jos käyttäjä omistaa sen
 */
const modifyActivityLog = async (userId, logId, updatedFields) => {
  try {
    let updateFields = [];
    let values = [];

    if (updatedFields.activity_type) {
      updateFields.push("activity_type = ?");
      values.push(updatedFields.activity_type);
    }
    if (updatedFields.duration_minutes) {
      updateFields.push("duration_minutes = ?");
      values.push(updatedFields.duration_minutes);
    }
    if (updatedFields.calories_burned) {
      updateFields.push("calories_burned = ?");
      values.push(updatedFields.calories_burned);
    }
    if (updatedFields.intensity) {
      updateFields.push("intensity = ?");
      values.push(updatedFields.intensity);
    }
    if (updatedFields.notes) {
      updateFields.push("notes = ?");
      values.push(updatedFields.notes);
    }

    if (updateFields.length === 0) {
      return { error: "ei päivitettäviä kenttiä" };
    }

    values.push(userId, logId);

    await promisePool.query(
      "UPDATE ActivityLogs SET " + updateFields.join(", ") + " WHERE user_id = ? AND log_id = ?",
      values
    );

    return { message: "Aktiivisuusmerkintä päivitetty" };
  } catch (error) {
    console.error("Error modifyActivityLog:", error);
    return { error: "Database error" };
  }
};

/**
 * Poistaa aktiivisuusmerkinnän, mutta vain jos käyttäjä omistaa sen
 */
const removeActivityLog = async (userId, logId) => {
  try {
    const [result] = await promisePool.query(
      "DELETE FROM ActivityLogs WHERE user_id = ? AND log_id = ?",
      [userId, logId]
    );

    if (result.affectedRows === 0) {
      return { error: "Activity log ei löytynyt" };
    }

    return { message: "Aktiivisuusmerkintä poistettu" };
  } catch (error) {
    console.error("Error removeActivityLog:", error);
    return { error: "Database error" };
  }
};

export { findActivityLogsByUserId, insertActivityLog, modifyActivityLog, removeActivityLog };
