require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocuments = YAML.load("./swagger/swagger.yml");

const router = require("./routes/index");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Router
app.use(router);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocuments));

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
