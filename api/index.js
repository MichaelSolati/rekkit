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

  mysql.model.query("SELECT threads.*, users.name AS poster FROM threads INNER JOIN users ON threads.created_by = users.username ORDER BY created_on DESC LIMIT ? , ? ", [start, count], function(err, rows) {
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
  let message = req.body.title || "";
  let created_by = req.body.created_by || "";

  if (message.length > 1024) {
    message = message.substing(0, 1021)+"...";
  }

  let title = message;
  if (title.length > 128) {
    title = title.substing(0, 125)+"...";
  }

  mysql.model.query("INSERT INTO threads (title, created_by) VALUES (?, ?)", [title, created_by], function(err, rows) {
    var result = {};
    if (err !== null) {
      result.error = err;
      res.setHeader('content-type', 'text/json');
      res.send(json_encode(result));
    } else {
      let thread_id = rows.insertId;
      mysql.model.query("INSERT INTO posts (thread_id, message, created_by) VALUES (?, ?, ?)", [thread_id, message, created_by], function(err, rows) {
        var result = {};
        if (err !== null) {
          result.error = err;
        } else {
          result.data = thread_id;
        }
        res.setHeader('content-type', 'text/json');
        res.send(json_encode(result));
      });
    }
  });
});

/* POSTS APIS */
router.get("/posts/:thread_id", function(req, res) {
  let thread_id = req.params.thread_id || "";
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

  mysql.model.query("SELECT posts.message, posts.created_on, users.name AS poster FROM posts INNER JOIN users ON posts.created_by = users.username WHERE posts.thread_id = ? ORDER BY posts.created_on ASC LIMIT ? , ? ", [thread_id, start, count], function(err, rows) {
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

router.post("/posts", function(req, res) {
  let thread_id = req.body.thread_id || "";
  let message = req.body.message || "";
  let created_by = req.body.created_by || "";
console.log(thread_id, message, created_by)
  if (message.length > 1024) {
    message = message.substing(0, 1021)+"...";
  }

  mysql.model.query("INSERT INTO posts (thread_id, message, created_by) VALUES (?, ?, ?)", [thread_id, message, created_by], function(err, rows) {
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
