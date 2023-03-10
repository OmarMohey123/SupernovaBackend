const mysql = require("mysql");
const express = require("express");
const app = express();
const morgan = require("morgan");
const port = 3000;

const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



const db = mysql.createConnection({
  host: "sql11.freemysqlhosting.net",
  user: "sql11592591",
  password: "C8BKPkw627",
  database: "sql11592591",
});

//connect to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connection done");
});
// rnd_MNRe6kjnEeHPQG8eorFxBzsv23D7

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

// This adds the logger.
app.use(morgan(":method :url :status - :response-time ms"));

const server = require("http").createServer(app);

server.listen(port, () => {
  console.log("listening on *:3000");
});

//query to database
app.get("/players", (req, res) => {
  // sql query to show all tables in the database
  let sql = `SELECT * FROM player;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

// add player to database
app.post("/players", (req, res) => {
  let body = req.body;
  console.log(req.body);
  let sql = `INSERT INTO player (name, number, phone, major, email) VALUES ('${body.name}', '${body.number}', '${body.phone}', '${body.major}', '${body.email}');`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.delete("/players/:name", (req, res) => {
  let name = req.params.name;
  console.log(name);
  let sql = `DELETE FROM player WHERE name = '${name}';`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.get("/competition", (req, res) => {
  // sql query to show all tables in the database
  let sql = `SELECT * FROM category;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.post("/competition", (req, res) => {
  let body = req.body;
  let sql = `INSERT INTO category (name) VALUES ('${body.name}');`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.get("/opponent", (req, res) => {
  // sql query to show all tables in the database
  let sql = `SELECT * FROM opponent;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.post("/opponent", (req, res) => {
  let body = req.body;
  let sql = `INSERT INTO opponent (name) VALUES ('${body.name}');`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.post("/game", (req, res) => {
  let body = req.body;
  let sql = `INSERT INTO game (opponent, home, category) VALUES ('${body.opponent}', '${body.isHome}', '${body.category}');`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.get("/game", (req, res) => {
  // sql query to show all tables in the database
  let sql = `SELECT * FROM game;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

// get the timestamp of the last inserted game
app.get("/gameT", (req, res) => {
  let category = req.query.category;
  let opponent = req.query.opponent;

  console.log(category);
  console.log(opponent);
  let sql = `SELECT timestamp FROM game 
  WHERE  category = '${category}' AND opponent = '${opponent}'
   ORDER BY timestamp DESC LIMIT 1;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.delete("/game/:opponent/:timestamp", (req, res) => {
  let opponent = req.params.opponent;
  let timestamp = req.params.timestamp;
  let sql = `DELETE FROM game WHERE opponent = '${opponent}' AND timestamp = '${timestamp}';`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

//
app.put("/gameUpdateOffence", (req, res) => {
  let body = req.body;
  let timestamp = body.timestamp;
  let opponent = body.opponent;
  let newValue = body.newValue;
  let sql = `
  UPDATE game SET startOffence = ${
    newValue ? 1 : 0
  } WHERE timestamp = "${timestamp}" AND opponent = "${opponent}";
  `;
  console.log(sql);
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

//delete actions from actionPerformed for specific game
app.delete("/gameActions/:opponent/:timestamp", (req, res) => {
  let opponent = req.params.opponent;
  let timestamp = req.params.timestamp;
  let sql = `DELETE FROM actionPerformed WHERE opponent = '${opponent}' AND gameTimestamp = '${timestamp}';`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.post("/gameDetails", (req, res) => {
  let body = req.body;
  let sql = `INSERT INTO game (opponent, timestamp, myScore, theirScore, home, category, startOffence) VALUES ('${body.opponent}', '${body.timestamp}', '${body.myScore}', '${body.theirScore}', '${body.isHome}', '${body.category}', '${body.startOffence}');`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.post("/gameActions", (req, res) => {
  let body = req.body;
  // console.log(body.values);
  let sql = `INSERT INTO actionPerformed (opponent, gameTimestamp, playerName, action, point, associatedPlayer, offence) VALUES ${body.values};`;
  // console.log("SQL", sql);

  let query = db.query(sql, [], (err, results) => {
    if (err) throw err;
    // console.log(results);
    res.send(results);
  });
});

app.get("/gameActions", (req, res) => {
  let opponent = req.query.opponent;
  let timestamp = req.query.timestamp;
  let sql = `SELECT * FROM actionPerformed WHERE opponent = '${opponent}' AND gameTimestamp = '${timestamp}';`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;

    console.log(results);
    res.send(results);
  });
});

app.post("/practice", (req, res) => {
  let date = req.body.date;
  let players = req.body.players;
  let sql = `INSERT INTO practice (date) VALUES (?);`;
  let query = db.query(sql, [date], (err, results) => {
    if (err) throw err;
    console.log(results);
    let id = results.insertId;
    let values = "";
    for (let i = 0; i < players.length; i++) {
      values += `('${id}','${players[i][0]}','${players[i][1] ? 1 : 0}','${
        players[i][2] ? 1 : 0
      }')`;
      if (i !== players.length - 1) {
        values += ",";
      }
    }
    console.log(values);

    sql = `INSERT INTO playersToCome (practiceId, playerName, isAttending, isExecused) VALUES ${values};`;
    query = db.query(sql, [], (err, results2) => {
      if (err) throw err;
      console.log(results2);
      res.send(results);
    });

    // res.send(results);
  });
});

app.post("/practicePlayers", (req, res) => {
  let body = req.body;
  let values = body.values;
  let sql = `INSERT INTO playersToCome (practiceId, playerName, isAttending, isExecused) VALUES ${values};`;
  let query = db.query(sql, [], (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.delete("/practice", (req, res) => {
  let id = req.body.id;
  let sql = `DELETE FROM practice WHERE id = ${id};`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.delete("/practicePlayers", (req, res) => {
  let id = req.body.id;
  let sql = `DELETE FROM playersToCome WHERE practiceID = ${id};`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.put("/practice", (req, res) => {
  let body = req.body;
  let id = body.id;
  let update = body.update;
  let sql = `UPDATE practice SET lastUpdate = ? WHERE id = ?;`;
  let query = db.query(sql, [update, id], (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.get("/practice", (req, res) => {
  let sql = `SELECT * FROM practice;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.get("/practicePlayers", (req, res) => {
  let sql = `SELECT * FROM playersToCome;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.post("/track", (req, res) => {
  let week = req.body.week;
  let players = req.body.players;
  let sql = `INSERT INTO track (week) VALUES (?);`;
  let query = db.query(sql, [week], (err, results) => {
    if (err) throw err;
    console.log(results);
    let id = results.insertId;
    let values = "";
    for (let i = 0; i < players.length; i++) {
      values += `('${id}','${players[i][0]}','${players[i][1] ? 1 : 0}','${
        players[i][2] ? 1 : 0
      }')`;
      if (i !== players.length - 1) {
        values += ",";
      }
    }
    console.log(values);

    sql = `INSERT INTO trackAttendance (trackId, playerName, isAttending, isExecused) VALUES ${values};`;
    query = db.query(sql, [], (err, results2) => {
      if (err) throw err;
      console.log(results2);
      res.send(results);
    });

    // res.send(results);
  });
});

app.post("/trackPlayers", (req, res) => {
  let body = req.body;
  let values = body.values;
  let sql = `INSERT INTO trackAttendance (trackId, playerName, isAttending, isExecused) VALUES ${values};`;
  let query = db.query(sql, [], (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.delete("/track", (req, res) => {
  let id = req.body.id;
  let sql = `DELETE FROM track WHERE id = ${id};`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.delete("/trackPlayers", (req, res) => {
  let id = req.body.id;
  let sql = `DELETE FROM trackAttendance WHERE trackId = ${id};`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.put("/track", (req, res) => {
  let body = req.body;
  let id = body.id;
  let update = body.update;
  let sql = `UPDATE track SET lastUpdate = ? WHERE id = ?;`;
  let query = db.query(sql, [update, id], (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.get("/track", (req, res) => {
  let sql = `SELECT * FROM track;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.get("/trackPlayers", (req, res) => {
  let sql = `SELECT * FROM trackAttendance;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.post("/treasury", (req, res) => {
  let name = req.body.name;
  let players = req.body.players;
  // console.log(players);
  let amount = req.body.amount;
  let sql = `INSERT INTO treasury (name) VALUES (?);`;
  let query = db.query(sql, [name], (err, results) => {
    if (err) throw err;
    console.log(results);
    let id = results.insertId;
    let values = "";
    for (let i = 0; i < players.length; i++) {
      values += `('${id}','${players[i]}','${amount}')`;
      if (i !== players.length - 1) {
        values += ",";
      }
    }
    console.log(values);

    sql = `INSERT INTO treasuryEntry (treasuryId, playerName, amountOwed) VALUES ${values};`;
    query = db.query(sql, [], (err, results2) => {
      if (err) throw err;
      console.log(results2);
      res.send(results);
    });

    // res.send(results);
  });
});
app.get("/treasury", (req, res) => {
  let sql = `SELECT * FROM treasury;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.get("/treasuryPlayers", (req, res) => {
  let sql = `SELECT * FROM treasuryEntry;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.delete("/treasury", (req, res) => {
  let id = req.body.id;
  let sql = `DELETE FROM treasury WHERE id = ${id};`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.delete("/treasuryPlayers", (req, res) => {
  let id = req.body.id;
  let sql = `DELETE FROM treasuryEntry WHERE treasuryId = ${id};`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.post("/treasuryPlayers", (req, res) => {
  let body = req.body;
  let values = body.values;
  let sql = `INSERT INTO treasuryEntry (treasuryId, playerName, amountOwed, amountPaid) VALUES ${values};`;
  let query = db.query(sql, [], (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.put("/treasury", (req, res) => {
  let body = req.body;
  let id = body.id;
  let update = body.update;
  let sql = `UPDATE treasury SET lastUpdate = ? WHERE id = ?;`;
  let query = db.query(sql, [update, id], (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});
