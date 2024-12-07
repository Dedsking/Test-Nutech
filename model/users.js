const connection = require("../config/database");

const updateBalance = async (result_amount, email) => {
  const SQLQuery = `UPDATE Users SET balance = ? WHERE email = ?`;
  const params = [result_amount, email];

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

const updateProfileImage = async (file_path, emailJWT) => {
  const SQLQuery = `UPDATE Users SET profile_image = ? WHERE email = ?`;
  const params = [file_path, emailJWT.email];
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
  updateBalance,
  updateProfile,
  updateProfileImage,
};
