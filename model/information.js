const connection = require("../config/database");

const getBanner = async () => {
  const SQLQuery = `SELECT * FROM banners`;

  try {
    const [results, fields] = await connection.execute(SQLQuery);
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

const getService = async () => {
  const SQLQuery = `SELECT * FROM services`;

  try {
    const [results, fields] = await connection.execute(SQLQuery);
    return results;
  } catch (error) {
    console.log(error);
  }
};

const checkService = async (body) => {
  const SQLQuery = `SELECT * FROM services WHERE service_code = ?`;
  const params = [body.service_code];

  try {
    const [results, fields] = await connection.execute(SQLQuery, params);
    return results;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getBanner, getService, checkService };
