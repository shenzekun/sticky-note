var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var data;
  if (req.session.user) {
    data = {
      isLogin: true,
      user: req.session.user
    }
  } else {
    data = {
      isLogin: false
    }
  }
  res.render('index', data);
});


router.get('/login', function (req, res, next) {
  if (req.session && req.session.user) {
    res.send({
      status: 1,
      username: req.session.user.username
    })
  } else {
    res.send({
      status: 0,
      errorMsg: '请登录！'
    })
  }
});

module.exports = router;