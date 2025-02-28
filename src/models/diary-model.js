import promisePool from "../utils/database";

// Hakee käyttäjän merkinnät
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







export { getEntriesForUser };
