var express = require('express');
var router = express.Router();
var mysql = require('../databases/mysql.js');

function json_encode(mixedVal) {
  return JSON.stringify(mixedVal);
}


/* GET HOME PAGE. */
router.get('/', function(req, res) {
  res.sendFile(appRoot + '/public/index.html');
});

/* USERS APIS */

router.post("/users/sign-in", function(req, res) {
  let username = req.body.username || "";
  let password = req.body.password || "";

  mysql.model.query("SELECT username, name FROM users WHERE username= ? AND password= ? LIMIT 1", [username, password], function(err, rows) {
    var result = {};
    if (err !== null) {
      result.error = err;
    } else if (rows[0]) {
      result.data = rows[0];
    } else {
      result.error = {
        "code": "CAN NOT MATCH",
        "errno": 1062,
        "sqlState": "23000",
        "index": 0
      };
    }
    res.setHeader('content-type', 'text/json');
    res.send(json_encode(result));
  });
});

router.post("/users/sign-up", function(req, res) {
  let username = req.body.username || "";
  let password = req.body.password;
  let name = req.body.name || "";

  mysql.model.query("INSERT INTO users (username, password, name) VALUES (? , ? , ?)", [username, password, name], function(err, rows) {
    var result = {};
    if (err !== null) {
      result.error = err;
    } else {
      result.data = true;
    }
    res.setHeader('content-type', 'text/json');
    res.send(json_encode(result));
  });
});

/* THREADS APIS */
router.get("/threads", function(req, res) {
  let start = req.query.start;
  let count = req.query.count;

  if (start === undefined) {
    start = 0;
  } else {
    start = parseInt(start);
  }

  if (count === undefined) {
    count = 50;
  } else {
    count = parseInt(count);
  }

  mysql.model.query("SELECT * FROM threads ORDER BY created_on DESC LIMIT ? , ? ", [start, count], function(err, rows) {
    let result = {};
    if (err !== null) {
      result.error = err;
    } else {
      result.data = rows;
    }
    res.setHeader('content-type', 'text/json');
    res.send(json_encode(result));
  });
});

router.post("/threads", function(req, res) {
  let title = req.body.title || "";
  let created_by = req.body.created_by || "";
  mysql.model.query("INSERT INTO threads (title, created_by) VALUES (?, ?)", [title, created_by], function(err, rows) {
    var result = {};
    if (err !== null) {
      result.error = err;
    } else {
      result.data = rows.insertId;
    }
    res.setHeader('content-type', 'text/json');
    res.send(json_encode(result));
  });
});

/* END */
module.exports = router;
