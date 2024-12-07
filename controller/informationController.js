const informationModel = require("../model/information");
const authModel = require("../model/auth");

const banners = async (req, res) => {
  const data = await informationModel.getBanner();

  return res.status(200).json({
    status: 200,
    message: "Sukses",
    data: data,
  });
};

const services = async (req, res) => {
  const emailJWT = req.user;

  const check = await authModel.checkEmail(emailJWT);

  if (check.length === 0) {
    return res.status(401).json({
      status: 401,
      message: "Akses ditolak",
      data: null,
    });
  }

  const data = await informationModel.getService();

  return res.status(200).json({
    status: 200,
    message: "Sukses",
    data: data,
  });
};

module.exports = { banners, services };
