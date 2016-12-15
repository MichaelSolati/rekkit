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
  try {
    let username = req.body.username.toLowerCase() || "";
    let password = req.body.password || "";

    mysql.model.query("SELECT users.username, users.name, admin.is_admin FROM users LEFT JOIN admin ON users.username = admin.username WHERE users.username= ? AND users.password= ? LIMIT 1", [username, password], function(err, rows) {
      let result = {};
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
  } catch (e) {}
});

router.post("/users/sign-up", function(req, res) {
  try {
    let username = req.body.username.toLowerCase() || "";
    let password = req.body.password;
    let name = req.body.name || "";

    mysql.model.query("INSERT INTO users (username, password, name) VALUES (? , ? , ?)", [username, password, name], function(err, rows) {
      let result = {};
      if (err !== null) {
        result.error = err;
      } else {
        result.data = true;
      }
      res.setHeader('content-type', 'text/json');
      res.send(json_encode(result));
    });
  } catch (e) {}
});

/* THREADS APIS */
router.delete("/threads", function(req, res) {
  try {
    let thread_id = req.query.thread_id || "";
    let username = req.query.username || "";
    // Get user details
    mysql.model.query("SELECT users.username, admin.is_admin FROM users LEFT JOIN admin ON users.username = admin.username WHERE users.username= ? LIMIT 1", [username], function(err, rows) {
      if (err !== null) {
        let result = {"error": err};
        res.setHeader('content-type', 'text/json');
        res.send(json_encode(result));
      } else if (rows[0] === undefined) {
        let result = {
          "error": {
            "code": "Can not find user",
            "errno": 1062,
            "sqlState": "23000",
            "index": 0
          }
        };
        res.setHeader('content-type','text/json');
        res.send(json_encode(result));
      } else {
        let user = JSON.parse(json_encode(rows[0]));
        // Get thread
        mysql.model.query("SELECT * FROM threads WHERE thread_id = ? LIMIT 1", [thread_id], function(err, rows) {
          let thread = JSON.parse(json_encode(rows[0]));
          if (err !== null) {
            let result = {"error": err};
            res.setHeader('content-type', 'text/json');
            res.send(json_encode(result));
          } else if ((thread.created_by === user.username || (user.is_admin === 1)) ) {
            // Delete thread if post belongs to user, or if it is an admin
            mysql.model.query("DELETE FROM threads WHERE thread_id = ? ",[thread.thread_id],function(err,rows){
              let result = {};
              if(err !== null) {
                result.error = err;
              } else {
                result.status = true;
              }
              res.setHeader('content-type','text/json');
              res.send(json_encode(result));
            });
          } else {
            let result = {
              "error": {
                "code": "You do not have permission to delete this thread",
                "errno": 1062,
                "sqlState": "23000",
                "index": 0
              }
            }
          }
        });
      }
    });
  } catch (e) {}
});

router.get("/threads", function(req, res) {
  try {
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
  } catch (e) {}
});

router.post("/threads", function(req, res) {
  try {
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
      let result = {};
      if (err !== null) {
        result.error = err;
        res.setHeader('content-type', 'text/json');
        res.send(json_encode(result));
      } else {
        let thread_id = rows.insertId;
        mysql.model.query("INSERT INTO posts (thread_id, message, created_by) VALUES (?, ?, ?)", [thread_id, message, created_by], function(err, rows) {
          let result = {};
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
  } catch (e) {}
});

/* POSTS APIS */
router.delete("/posts", function(req, res) {
  try {
    let post_id = req.query.post_id || "";
    let thread_id = req.query.thread_id || "";
    let username = req.query.username || "";
    // Get user details
    mysql.model.query("SELECT users.username, admin.is_admin FROM users LEFT JOIN admin ON users.username = admin.username WHERE users.username= ? LIMIT 1", [username], function(err, rows) {
      if (err !== null) {
        let result = {"error": err};
        res.setHeader('content-type', 'text/json');
        res.send(json_encode(result));
      } else {
        let user = JSON.parse(json_encode(rows[0]));
        // Get post
        mysql.model.query("SELECT * FROM posts WHERE post_id = ? AND thread_id = ? LIMIT 1", [post_id, thread_id], function(err, rows) {
          let post = JSON.parse(json_encode(rows[0]));
          if (err !== null) {
            let result = {"error": err};
            res.setHeader('content-type', 'text/json');
            res.send(json_encode(result));
          } else if ((post.created_by === user.username || (user.is_admin === 1)) ) {
            // Delete post if post belongs to user, or if it is an admin
            mysql.model.query("DELETE FROM posts WHERE post_id = ? ",[post.post_id],function(err,rows){
              let result = {};
              if(err !== null) {
                result.error = err;
              } else {
                result.status = true;
                // Check if there are any posts left in the thread
                mysql.model.query("SELECT COUNT(*) FROM posts WHERE thread_id = ? ", [post.thread_id], function(err, rows) {
                  let count = JSON.parse(json_encode(rows[0]))["COUNT(*)"];
                  if (count === 0) {
                    // If no posts left, delete the thread
                    mysql.model.query("DELETE FROM threads WHERE thread_id = ?  ",[post.thread_id],function(err,rows){});
                  }
                });
              }
              res.setHeader('content-type','text/json');
              res.send(json_encode(result));
            });
          } else {
            let result = {
              "error": {
                "code": "You do not have permission to delete this post",
                "errno": 1062,
                "sqlState": "23000",
                "index": 0
              }
            };
            res.setHeader('content-type','text/json');
            res.send(json_encode(result));
          }
        });
      }
    });
  } catch (e) {}
});

router.get("/posts/:thread_id", function(req, res) {
  try {
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

    mysql.model.query("SELECT posts.post_id, posts.message, posts.created_on, posts.created_by, users.name AS poster FROM posts INNER JOIN users ON posts.created_by = users.username WHERE posts.thread_id = ? ORDER BY posts.created_on ASC LIMIT ? , ? ", [thread_id, start, count], function(err, rows) {
      let result = {};
      if (err !== null) {
        result.error = err;
      } else {
        result.data = rows;
      }
      res.setHeader('content-type', 'text/json');
      res.send(json_encode(result));
    });
  } catch (e) {}
});

router.post("/posts", function(req, res) {
  try {
    let thread_id = req.body.thread_id || "";
    let message = req.body.message || "";
    let created_by = req.body.created_by || "";
    if (message.length > 1024) {
      message = message.substing(0, 1021)+"...";
    }

    mysql.model.query("INSERT INTO posts (thread_id, message, created_by) VALUES (?, ?, ?)", [thread_id, message, created_by], function(err, rows) {
      let result = {};
      if (err !== null) {
        result.error = err;
      } else {
        result.data = rows.insertId;
      }
      res.setHeader('content-type', 'text/json');
      res.send(json_encode(result));
    });
  } catch (e) {}
});

/* PROFILE APIS */
router.get("/profile/:username", function(req, res) {
  try {
    let username = req.params.username.toLowerCase() || "";

    mysql.model.query("SELECT users.username, users.name, admin.is_admin FROM users LEFT JOIN admin ON users.username = admin.username WHERE users.username= ? LIMIT 1", [username], function(err, rows) {
      if (err !== null) {
        let result = {error: err};
        res.setHeader('content-type', 'text/json');
        res.send(json_encode(result));
      } else if (rows[0] === undefined) {
        let result = {
          "error": {
            "code": "Can not find profile",
            "errno": 1062,
            "sqlState": "23000",
            "index": 0
          }
        };
        res.setHeader('content-type','text/json');
        res.send(json_encode(result));
      } else {
        let user = JSON.parse(json_encode(rows[0]));
        mysql.model.query("SELECT * FROM threads WHERE created_by = ? ORDER BY created_on DESC", [user.username], function(err, rows) {
          let result = {};
          if (err !== null) {
            result.error = err;
          } else {
            user.threads = JSON.parse(json_encode(rows));
            result.data = user;
          }
          res.setHeader('content-type', 'text/json');
          res.send(json_encode(result));
        });
      }
    });
  } catch (e) {}
});

/* ADMIN APIS */
router.post("/admin", function(req, res) {
  try {
    let username = req.body.username || "";

    mysql.model.query("INSERT INTO admin (username, is_admin) VALUES (?, ?)", [username, 1], function(err, rows) {
      let result = {};
      if (err !== null) {
        result.error = err;
      } else {
        result.data = rows.insertId;
      }
      res.setHeader('content-type', 'text/json');
      res.send(json_encode(result));
    });
  } catch (e) {}
});

router.delete("/admin", function(req, res) {
  try {
    let username = req.query.username || "";
    mysql.model.query("DELETE FROM admin WHERE username = ? ", [username], function(err,rows){ 
      var result = {};
      if(err !== null) {
        result.error = err;
      } else {
        result.data = true;
      }
      res.setHeader('content-type','text/json');
      res.send(json_encode(result));
    });
  } catch (e) {}
});

/* END */
module.exports = router;
