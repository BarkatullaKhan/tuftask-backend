const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
});

app.get("/", (req, res) => {
  return res.json(`From Backend ${process.env.MYSQL_HOST}`);
});

app.get("/bannerData", (req, res) => {
  const query = "SELECT * FROM banner";
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/saveData", (req, res) => {
  const body = req.body;
  const query = "SELECT * FROM banner";
  let saveQuery = "";
  db.query(query, async (err, data) => {
    if (err) return res.json(err);
    console.log(data.length);
    if ((await data.length) > 0) {
      saveQuery = `UPDATE banner SET showTill ='${body.showTill}' ,description = '${body.description}',link = '${body.link}',showBanner = ${body.showBanner} WHERE id = 1`;
    } else {
      saveQuery = `INSERT INTO banner (showTill, description, link, showBanner) VALUES ('${body.showTill}', '${body.description}', '${body.link}', ${body.showBanner})`;
    }
    db.query(saveQuery, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Listning");
});
