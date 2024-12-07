const jwt = require("jsonwebtoken");
const authModel = require("../model/auth");
const usersModel = require("../model/users");
const yup = require("yup");

const schemaRegister = yup.object().shape({
  email: yup
    .string()
    .email("Parameter email tidak sesuai format")
    .required("Email tidak boleh kosong"),
  first_name: yup.string(),
  last_name: yup.string(),
  password: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .required("Password tidak boleh kosong"),
});

const schemaLogin = yup.object().shape({
  email: yup
    .string()
    .email("Parameter email tidak sesuai format")
    .required("Email tidak boleh kosong"),
  password: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .required("Password tidak boleh kosong"),
});

const registration = async (req, res) => {
  // validate registration
  const { body } = req;

  try {
    await schemaRegister.validate(body, { abortEarly: false });
  } catch (errors) {
    const errorMessage = errors.inner.map((error) => error.message);
    return res.status(404).json({
      status: 0,
      messages: errorMessage,
      data: null,
    });
  }

  const check = await authModel.checkEmail(body);
  if (check.length !== 0) {
    return res.status(400).json({
      status: 400,
      message: "Email sudah terdaftar",
      data: null,
    });
  }

  try {
    //register
    const data = await authModel.register(body);

    res.status(200).json({
      status: 200,
      message: "Registrasi berhasil silahkan login",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Eror",
      serverMessage: error,
    });
  }
};

const login = async (req, res) => {
  //validate request
  const { body } = req;

  try {
    await schemaLogin.validate(body, { abortEarly: false });
  } catch (errors) {
    const errorMessage = errors.inner.map((error) => error.message);
    return res.status(400).json({
      status: 400,
      messages: errorMessage,
      data: null,
    });
  }

  //check email di database
  const check = await authModel.checkEmail(body);

  if (check.length === 0) {
    return res.status(401).json({
      status: 401,
      message: "Username atau password salah",
      data: null,
    });
  }

  const userDb = check[0];

  if (userDb.password !== body.password) {
    return res.status(401).json({
      status: 401,
      message: "Username atau password salah",
      data: null,
    });
  }

  const user = {
    id: userDb.id,
    email: userDb.email,
  };
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).json({
    message: "Login Sukses",
    data: {
      token,
    },
  });
};

const profile = async (req, res) => {
  const emailJWT = req.user;

  const check = await authModel.checkEmail(emailJWT);

  if (check.length === 0) {
    return res.status(401).json({
      status: 401,
      message: "Akses ditolak",
      data: null,
    });
  }

  const profile = check[0];

  return res.status(200).json({
    status: 200,
    message: "Update Pofile berhasil",
    data: {
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      profile_image: profile.profile_image,
    },
  });
};

const profile_update = async (req, res) => {
  const emailJWT = req.user;
  const { body } = req;

  const check = await authModel.checkEmail(emailJWT);

  if (check.length === 0) {
    return res.status(401).json({
      status: 401,
      message: "Akses ditolak",
      data: null,
    });
  }

  //update data
  const update = await usersModel.updateProfile(body, emailJWT);

  if (update.length === 0) {
    return res.status(404).json({
      status: 404,
      message: "Terjadi kesalahan",
      data: null,
    });
  }

  //check data untuk ditampilkan
  const checkAgain = await authModel.checkEmail(emailJWT);

  const profile = checkAgain[0];

  return res.status(200).json({
    status: 200,
    message: "Update Pofile berhasil",
    data: {
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      profile_image: profile.profile_image,
    },
  });
};

const update_image = async (req, res) => {
  const emailJWT = req.user;
  const file = req.file;
  const url = process.env.URL_SAVE_FILE;

  const check = await authModel.checkEmail(emailJWT);

  if (check.length === 0) {
    return res.status(401).json({
      status: 401,
      message: "Akses ditolak",
      data: null,
    });
  }

  const allowedMimeTypes = ["image/png", "image/jpeg"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return res.status(400).json({
      status: 102,
      message: "Format Image tidak sesuai",
      data: null,
    });
  }

  if (file.size >= 2097152) {
    return res.status(400).json({
      status: 102,
      message: "Size Image terlalu besar",
      data: null,
    });
  }

  const file_path = `${url}/upload-${file.originalname}`;

  //update data profile image
  const update = await usersModel.updateProfileImage(file_path, emailJWT);

  if (update.length === 0) {
    return res.status(404).json({
      status: 404,
      message: "Terjadi kesalahan",
      data: null,
    });
  }

  //check data untuk ditampilkan
  const checkAgain = await authModel.checkEmail(emailJWT);

  const profile = checkAgain[0];

  return res.status(200).json({
    status: 200,
    message: "Update Pofile Image berhasil",
    data: {
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      profile_image: profile.profile_image,
    },
  });
};

module.exports = { login, registration, profile, profile_update, update_image };
