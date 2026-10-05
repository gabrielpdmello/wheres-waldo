require("dotenv").config();
const app = require("./src/app");
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
app.listen(PORT, HOST, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on ${HOST}:${PORT}`);
});
