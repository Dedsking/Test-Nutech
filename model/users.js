const connection = require("../config/database");

const updateBalance = async (result_amount, email) => {
  const SQLQuery = `UPDATE users SET balance = ? WHERE email = ?`;
  const params = [result_amount, email];

  try {
    const conn = await connection.getConnection();
    const [results, fields] = await connection.execute(SQLQuery, params);
    conn.release();
    return results;
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async (body, emailJWT) => {
  const SQLQuery = `UPDATE users SET first_name = ?, last_name = ? WHERE email = ?`;
  const params = [body.first_name, body.last_name, emailJWT.email];
  try {
    const conn = await connection.getConnection();
    const [results, fields] = await connection.execute(SQLQuery, params);
    conn.release();
    return results;
  } catch (error) {
    console.log(error);
  }
};

const updateProfileImage = async (file_path, emailJWT) => {
  const SQLQuery = `UPDATE users SET profile_image = ? WHERE email = ?`;
  const params = [file_path, emailJWT.email];
  try {
    const conn = await connection.getConnection();
    const [results, fields] = await connection.execute(SQLQuery, params);
    conn.release();
    return results;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  updateBalance,
  updateProfile,
  updateProfileImage,
};
