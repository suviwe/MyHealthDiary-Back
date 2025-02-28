import promisePool from "../utils/database.js";



/**
 *fetch user by id
 *using prepared statement
 * @param {number} userID
 * @returns
 */
 const selectUserById = async (userID) => {

  const [rows] = await promisePool.query('select user_id, username, email, created_at, user_level from users where user_id=?', [userID], );

  console.log(rows);
  return rows[0];
};

/**
 *käyttäjän rekisteröinti(tietokantaan lisäys)
 * @param {*} user
 * @returns
 */
const insertUser = async (user) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO Users (username, password, email) VALUES (?, ?, ? )',
      [user.username, user.password, user.email],);

    console.log('insertUser', result);
    //return only first item of the result array
    return result.insertId;
  } catch (error) {
    console.log(error);
    throw new Error('database error ininsertUser');
  }

};


/**
 *fhaetaan käyttäjä käyttäjänimen perusteella
 * @param {*} username
 * @returns {object} user data
 */
const selectUserByUserName = async (username) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT user_id, username, password, email, created_at, user_level FROM Users WHERE username=?',
      [username],
    );
    console.log(rows);
    // return only first item of the result array
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};


/**
 *isätään käyttäjän poistamine  ID:n perusteella
 * @param {*} userID
 * @returns
 */
const deleteUserById = async (userID) => {
  const sql = "DELETE FROM Users WHERE user_id = ?";

  try {
    await promisePool.query(sql, [userID]);
    return { message: "User deleted" };
  } catch (e) {
    console.error("error deleteUserById:", e.message);
    return { error: e.message };
  }
};

/**
 * Päivittää käyttäjän tiedot
 * @param {number} userId
 * @param {object} user
 * @returns {object} result
 */
const updateUserById = async (userId, { username, email, password }) => {
  try {
    // Tarkistetaan, mitkä kentät päivitetään
    let updateFields = [];
    let values = [];

    if (username) {
      updateFields.push("username = ?");
      values.push(username);
    }

    if (email) {
      updateFields.push("email = ?");
      values.push(email);
    }

    if (password) {
      updateFields.push("password = ?");
      values.push(password);
    }

    if (updateFields.length === 0) {
      return { error: "No fields to update" };
    }

    values.push(userId);

    const [result] = await promisePool.query(
      "UPDATE Users SET " + updateFields.join(", ") + " WHERE user_id = ?",
      values
    );
    return { message: "käytttäjätietoja on muokattu", result };
  } catch (error) {
    console.error("Error käyttäjätietojen muokkaamisessa:", error);
    return { error: "Database error ubdateUserById" };
  }
};







export {selectUserById, insertUser, deleteUserById, selectUserByUserName, updateUserById};

