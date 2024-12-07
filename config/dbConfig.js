module.exports = {
  HOST: process.env.HOST || "localhost",
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DATABASE: process.env.DATABASE,
  PORT: process.env.PORT_DB,
  DIALECT: process.env.DIALECT,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
