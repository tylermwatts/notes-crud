const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const db = require("./config/db");

require("dotenv").config();

const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err);
  require("./app/routes")(app, database);

  app.listen(port, () => console.log(`Listening on port ${port}...`));

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`${err}`);
  });

  app.use((req, res, next) => {
    res.status(404).send("Page does not exist.");
  });
});
