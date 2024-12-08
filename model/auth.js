const connection = require("../config/database");

const register = async (body) => {
  const SQLQuery = `INSERT INTO users (email, first_name, last_name, password) VALUES (?,?,?,?)`;
  const params = [body.email, body.first_name, body.last_name, body.password];

  try {
    const [results, fields] = await connection.execute(SQLQuery, params);
    return results;
  } catch (error) {
    console.log(error);
  }
};

const checkEmail = async (body) => {
  const SQLQuery = `SELECT * FROM users WHERE email = ?`;
  const params = [body.email];

  try {
    const [results, fields] = await connection.execute(SQLQuery, params);
    return results;
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async (body, emailJWT) => {
  const SQLQuery = `UPDATE users SET first_name = ?, last_name = ? WHERE email = ?`;
  const params = [body.first_name, body.last_name, emailJWT.email];
  try {
    const [results, fields] = await connection.execute(SQLQuery, params);
    return results;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  checkEmail,
  updateProfile,
};
