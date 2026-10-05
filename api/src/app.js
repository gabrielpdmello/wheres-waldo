const express = require("express");
const routes = require("./routes");
const cors = require("cors");

// express setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS setup
if (process.env.ENV === "prod") {
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
  const corsOptions = {
    origin: function (origin, callback) {
      // allows requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  app.use(cors(corsOptions));
} else {
  app.use(cors()); // enable all CORS requests
}

// routes
app.use("/levels", routes.level);
app.use("/leaderboards", routes.leaderboard);
app.use("/games", routes.game);

app.use(express.static("public"));

app.use((err, req, res, next) => {
  if (err.status === undefined) {
    console.log(err);
  }

  return res
    .status(err.status || 500)
    .json(
      err.status !== undefined
        ? { message: err.message }
        : { message: "Internal server error" },
    );
});

module.exports = app;
