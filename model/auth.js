const connection = require("../config/database");

const register = async (body) => {
  const SQLQuery = `INSERT INTO users (email, first_name, last_name, password) VALUES (?,?,?,?)`;
  const params = [body.email, body.first_name, body.last_name, body.password];

  try {
    const [results, fields] = await connection.query(SQLQuery, params);
    return results;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Something when wrong",
      data: null,
    });
  }
};

const checkEmail = async (body) => {
  const SQLQuery = `SELECT * FROM Users WHERE email = ?`;
  const params = [body.email];

  try {
    const [results, fields] = await connection.query(SQLQuery, params);
    return results;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Something when wrong",
      data: null,
    });
  }
};

const updateProfile = async (body, emailJWT) => {
  const SQLQuery = `UPDATE Users SET first_name = ?, last_name = ? WHERE email = ?`;
  const params = [body.first_name, body.last_name, emailJWT.email];
  try {
    const [results, fields] = await connection.query(SQLQuery, params);
    return results;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Something when wrong",
      data: null,
    });
  }
};

module.exports = {
  register,
  checkEmail,
  updateProfile,
};
