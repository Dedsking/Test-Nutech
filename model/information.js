const connection = require("../config/database");

const getBanner = async () => {
  const SQLQuery = `SELECT * FROM Banners`;

  try {
    const [results, fields] = await connection.query(SQLQuery);
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
  const SQLQuery = `SELECT * FROM Services`;

  try {
    const [results, fields] = await connection.query(SQLQuery);
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

const checkService = async (body) => {
  const SQLQuery = `SELECT * FROM Services WHERE service_code = ?`;
  const params = [body.service_code];

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

module.exports = { getBanner, getService, checkService };
