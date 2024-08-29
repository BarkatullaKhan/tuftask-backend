const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const conn_pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port:process.env.MYSQL_PORT
});

app.get("/", (req, res) => {
  return res.json(`From Backend ${process.env.MYSQL_HOST}`);
});

app.get("/createTable", (req, res) => {
  const query =
    "CREATE TABLE banner (id INT AUTO_INCREMENT PRIMARY KEY, showTill TEXT NOT NULL, description TEXT, link TEXT, showBanner BOOLEAN NOT NULL DEFAULT TRUE)";
  conn_pool.getConnection(function (err, connection) {
    if (err) {
      // connection.release();
      console.log(err);
      res.json(err);
    }
    connection.query(query, (err2, result) => {
      if (err2) {
        console.log(err2);
        // connection.release();
      }
      res.json(result);
      // connection.release();
    });
  });
});

app.get("/bannerData", (req, res) => {
  const query = "SELECT * FROM banner";
  conn_pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      console.log(err);
      res.json(err);
    }
    connection.query(query, (err2, result) => {
      if (err2) {
        console.log(err2);
        connection.release();
      }
      res.json(result);
      connection.release();
    });
  });
});

app.post("/saveData", (req, res) => {
  const body = req.body;
  const query = "SELECT * FROM banner";
  let saveQuery = "";
  conn_pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      console.log(err);
      return res.json(err);
    }
    connection.query(query, (err2, result) => {
      if (err2) {
        console.log(err2);
        connection.release();
        return res.json(err2);
      }
      if (result.length > 0) {
        saveQuery = `UPDATE banner SET showTill ='${body.showTill}' ,description = '${body.description}',link = '${body.link}',showBanner = ${body.showBanner} WHERE id = 1`;
      } else {
        saveQuery = `INSERT INTO banner (showTill, description, link, showBanner) VALUES ('${body.showTill}', '${body.description}', '${body.link}', ${body.showBanner})`;
      }

      connection.query(saveQuery, (err3, result2) => {
        if (err3) {
          console.log(err3);
          connection.release();
          return res.json(err3);
        }
        return res.json(result2);
      });
      connection.release();
    });
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Listning");
});
