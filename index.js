const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const router = require("./routes/movies");
const routerUsers = require("./routes/users");
const routerLogin = require("./auth");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const passport = require("passport");
const cors = require("cors");

const port = process.env.PORT || 8080;

// connect to DB local
// mongoose.connect("mongodb://127.0.0.1/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// connect to MongoDB Atlas
console.log(process.env.CONNECTION_URI, "===***********===");
mongoose
  .connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the DB"))
  .catch((error) => console.log(error));

// init app
const app = express();

// define a list of allowed domains
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

// // set a cors for allowed domains
// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       // if a specific origin isn't found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
//       return callback(new Error(message), false);
//     }
//     return callback(null,true);
//   }
// }));

// init body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// passport
require("./passport");

// create a write stream (in append mode)
// a "log.txt" file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

// middlewares
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.static("public"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// routers
app.use("/", router);
app.use("/", routerUsers);
app.use("/", routerLogin);

// swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Get requests
app.get("/", (req, res) => {
  res.send("Welcome to my Movie App!");
});

// port listener
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
