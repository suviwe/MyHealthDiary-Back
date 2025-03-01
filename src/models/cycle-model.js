import promisePool from "../utils/database.js";

// Lisää kuukautiskierron merkintä
const insertMenstrualCycle = async (cycle) => {
  try {
    const [result] = await promisePool.query(
      "INSERT INTO MenstrualCycle (user_id, start_date, end_date, cycle_length, ovulation_date, symptoms, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        cycle.user_id,
        cycle.start_date,
        cycle.end_date,
        cycle.cycle_length,
        cycle.ovulation_date,
        cycle.symptoms,
        cycle.notes
      ]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error inserting menstrual cycle:", error);
    return { error: "Error inserting menstrual cycle" };
  }
};

// Muokkaa kuukautiskierron merkintää
const modifyMenstrualCycle = async (userId, cycleId, updatedFields) => {
  try {
    let updateFields = [];
    let values = [];

    if (updatedFields.start_date) {
      updateFields.push("start_date = ?");
      values.push(updatedFields.start_date);
    }
    if (updatedFields.end_date) {
      updateFields.push("end_date = ?");
      values.push(updatedFields.end_date);
    }
    if (updatedFields.cycle_length) {
      updateFields.push("cycle_length = ?");
      values.push(updatedFields.cycle_length);
    }
    if (updatedFields.ovulation_date) {
      updateFields.push("ovulation_date = ?");
      values.push(updatedFields.ovulation_date);
    }
    if (updatedFields.symptoms) {
      updateFields.push("symptoms = ?");
      values.push(updatedFields.symptoms);
    }
    if (updatedFields.notes) {
      updateFields.push("notes = ?");
      values.push(updatedFields.notes);
    }

    if (updateFields.length === 0) {
      return { error: "No fields to update" };
    }

    values.push(userId, cycleId);

    await promisePool.query(
      "UPDATE MenstrualCycle SET " + updateFields.join(", ") + " WHERE user_id = ? AND cycle_id = ?",
      values
    );

    return { message: "Menstrual cycle updated" };
  } catch (error) {
    console.error("Error modifyMenstrualCycle:", error);
    return { error: "Error modifying menstrual cycle" };
  }
};

// Hakee kaikki kuukautiskierron tiedot käyttäjän ID:n perusteella
const findMenstrualCyclesByUserId = async (userId) => {
  try {
    const [result] = await promisePool.query(
      "SELECT * FROM MenstrualCycle WHERE user_id = ?",
      [userId]
    );
    return result;
  } catch (error) {
    console.error("Error fetching menstrual cycles:", error);
    return { error: "Database error" };
  }
};

// Lasketaan keskimääräinen kierron pituus
const fetchAverageCycleLength = async (userId) => {
  try {
    const [result] = await promisePool.query(
      'SELECT AVG(cycle_length) AS avg_cycle_length FROM MenstrualCycle WHERE user_id = ?',
      [userId]
    );
    return {
      avg_cycle_length: result[0]?.avg_cycle_length || 0
    };
  } catch (error) {
    console.error("Error fetching average cycle length:", error);
    return { error: "Database error" };
  }
};

// Hakee kaikki kiertojen pituudet
const fetchCycleLengths = async (userId) => {
  try {
    const [result] = await promisePool.query(
      'SELECT cycle_length FROM MenstrualCycle WHERE user_id = ?',
      [userId]
    );
    return result;
  } catch (error) {
    console.error("Error fetching cycle lengths:", error);
    return { error: "Database error" };
  }
};

// Lasketaan ovulaatiopäivä
const fetchOvulationDate = async (userId) => {
  try {
    const [result] = await promisePool.query(
      'SELECT cycle_id, start_date, cycle_length FROM MenstrualCycle WHERE user_id = ?',
      [userId]
    );

    const ovulationDates = result.map(cycle => {
      const ovulationDate = new Date(cycle.start_date);
      ovulationDate.setDate(ovulationDate.getDate() + cycle.cycle_length - 14); // Ovulaatio 14 päivää ennen seuraavaa kiertoa
      return {
        cycle_id: cycle.cycle_id,
        ovulation_date: ovulationDate.toISOString().split('T')[0]  // Palautetaan päivämäärä ilman aikahaarukkaa
      };
    });

    return ovulationDates;
  } catch (error) {
    console.error("Error fetching ovulation dates:", error);
    return { error: "Database error" };
  }
};

export { fetchAverageCycleLength, fetchCycleLengths, fetchOvulationDate, insertMenstrualCycle, modifyMenstrualCycle, findMenstrualCyclesByUserId };
