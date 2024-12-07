const authModal = require("../model/auth");
const informationModal = require("../model/information");
const transactionModel = require("../model/transaction");
const usersModel = require("../model/users");
const yup = require("yup");

const schemaTopUp = yup.object().shape({
  top_up_amount: yup
    .number("Input harus angka")
    .positive()
    .integer()
    .min(1, "Input tidak boleh 0")
    .required("Input tidak boleh kosong"),
});

const balance = async (req, res) => {
  const emailJWT = req.user;

  try {
    const check = await authModal.checkEmail(emailJWT);

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
      message: "Get Data Balance Berhasil",
      data: {
        balance: profile.balance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something when wrong",
    });
  }
};

const topup = async (req, res) => {
  const { body } = req;
  try {
    await schemaTopUp.validate(body, { abortEarly: false });
  } catch (errors) {
    const errorMessage = errors.inner.map((error) => error.message);
    return res.status(404).json({
      status: 0,
      messages: errorMessage,
      data: null,
    });
  }

  const emailJWT = req.user;
  const top_up_body = body.top_up_amount;
  const user_id = emailJWT.id;

  try {
    const check = await authModal.checkEmail(emailJWT);

    if (check.length === 0) {
      return res.status(401).json({
        status: 401,
        message: "Akses ditolak",
        data: null,
      });
    }

    // masukkan transaksi ke table transaction
    const transaction_topup = await transactionModel.insertTransactionTopup(
      user_id,
      top_up_body
    );
    if (transaction_topup.length === 0) {
      return res.status(500).json({
        status: 500,
        message: "Something when wrong",
        data: null,
      });
    }

    const profile = check[0];

    //perhitungan balance
    const result = profile.balance + top_up_body;

    //update balance users
    const update_balance = await usersModel.updateBalance(
      result,
      profile.email
    );

    if (update_balance.length === 0) {
      return res.status(500).json({
        status: 500,
        message: "Something when wrong",
        data: null,
      });
    }

    const checkBalance = await authModal.checkEmail(emailJWT);

    if (checkBalance.length === 0) {
      return res.status(500).json({
        status: 500,
        message: "Something when wrong",
        data: null,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Top Up Balance Berhasil",
      data: {
        balance: checkBalance[0].balance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something when wrong",
      data: null,
    });
  }
};

const transaction = async (req, res) => {
  const { body } = req;

  const emailJWT = req.user;
  const user_id = emailJWT.id;

  const check = await authModal.checkEmail(emailJWT);

  if (check.length === 0) {
    return res.status(401).json({
      status: 401,
      message: "Akses ditolak",
      data: null,
    });
  }

  try {
    // check db service
    const checkService = await informationModal.checkService(body);
    if (checkService.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Service atau Layanan tidak ditemukan",
        data: null,
      });
    }

    const service = checkService[0];

    // masukkan transaksi ke table transaction
    const transaction_payment = await transactionModel.insertTransactionPayment(
      user_id,
      service
    );
    if (transaction_payment.length === 0) {
      return res.status(500).json({
        status: 500,
        message: "Something when wrong",
        data: null,
      });
    }

    const profile = check[0];

    //perhitungan balance
    const result = profile.balance - service.service_tarif;

    //update balance users
    const update_balance = await usersModel.updateBalance(
      result,
      profile.email
    );

    if (update_balance.length === 0) {
      return res.status(500).json({
        status: 500,
        message: "Something when wrong",
        data: null,
      });
    }

    const checkBalance = await authModal.checkEmail(emailJWT);

    if (checkBalance.length === 0) {
      return res.status(500).json({
        status: 500,
        message: "Something when wrong",
        data: null,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Transaksi Berhasil",
      data: {
        balance: checkBalance[0].balance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something when wrong",
      data: null,
    });
  }
};

const history = async (req, res) => {
  const query = req.query;
  const emailJWT = req.user;
  const user_id = emailJWT.id;

  try {
    const check = await authModal.checkEmail(emailJWT);

    if (check.length === 0) {
      return res.status(401).json({
        status: 401,
        message: "Akses ditolak",
        data: null,
      });
    }

    // ambil data dari table transaction
    const history = await transactionModel.getHistory(query, user_id);

    return res.status(200).json({
      status: 200,
      message: "Get History Berhasil",
      data: {
        offset: parseInt(query.offset) ?? 0,
        limit: parseInt(query.limit) ?? 0,
        records: history,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something when wrong",
      data: null,
    });
  }
};

module.exports = {
  balance,
  topup,
  transaction,
  history,
};
