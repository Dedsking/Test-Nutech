const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const middlewareAuth = require("../middleware/middlewareAuth");
const membership = require("../controller/membershipController");
const information = require("../controller/informationController");
const transaction = require("../controller/transactionController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Folder tujuan penyimpanan
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Validasi file

const upload = multer({ storage });

// Daftar membership
router.post("/registration", membership.registration);

// Route untuk login dan mendapatkan token JWT
router.post("/login", membership.login);

// Route untuk profile
router.get("/profile", middlewareAuth, membership.profile);

//Route untuk profile update
router.put("/profile/update", middlewareAuth, membership.profile_update);

//Route untuk profile update image
router.post(
  "/profile/image",
  middlewareAuth,
  upload.single("file"),
  membership.update_image
);

// Route untuk mengambil data banners
router.get("/banner", information.banners);

// Route untuk mengambil data services
router.get("/service", middlewareAuth, information.services);

// Route untuk mengambil data services
router.get("/balance", middlewareAuth, transaction.balance);

// Route untuk user topup
router.post("/topup", middlewareAuth, transaction.topup);

// Route untuk user topup
router.post("/transaction", middlewareAuth, transaction.transaction);

// Route untuk user topup
router.get("/transaction/history", middlewareAuth, transaction.history);

module.exports = router;
