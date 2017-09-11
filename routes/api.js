var express = require('express');
var router = express.Router();
var Note = require('../model/note');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/notes', function (req, res, next) {
  var opts = {
    raw: true
  }
  if (req.session && req.session.user) {
    opts.where = {
      userid: req.session.user.id
    }
  }
  Note.findAll({
    opts
  }).then(function (notes) {
    res.send({
      status: 1,
      data: notes
    })
  }).catch(function () {
    res.send({
      status: 0,
      errorMsg: '数据库异常'
    })
  });
});

/* 添加 */
router.post('/notes/add', function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.send({
      status: 0,
      errorMsg: '请先登录'
    })
  }
  var note = req.body.note;
  var userid = req.session.user.id;
  if (!note) {
    return res.send({
      status: 0,
      errorMsg: '内容不能为空！'
    })
  }

  Note.create({
    userid: userid,
    text: note
  }).then(function (data) {
    res.send({
      status: 1
    })
  }).catch(function (e) {
    res.send({
      status: 0,
      errorMsg: '数据库异常或者你没有权限'
    });
  });
});


/* 编辑 */

router.post('/notes/edit', function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.send({
      status: 0,
      errorMsg: '请先登录'
    })
  }
  var editid = req.body.id;
  var note = req.body.note;
  var userid = req.session.user.id;
  if (!note) {
    return res.send({
      status: 0,
      errorMsg: '内容不能为空！'
    })
  }
  Note.update({
    text: note
  }, {
    where: {
      id: editid,
      userid: userid
    }
  }).then(function (data) {
    console.log(data);
    res.send({
      status: 1
    })
  }).catch(function (e) {
    res.send({
      status: 0,
      errorMsg: "数据库异常或者你没有权限"
    })
  })
})

/* 删除 */
router.post('/notes/delete', function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.send({
      status: 0,
      errorMsg: '请先登录'
    })
  }
  var deleteid = req.body.id;
  var userid = req.session.user.id;
  Note.destroy({
    where: {
      id: deleteid,
      userid: userid
    }
  }).then(function (data) {
    if (data !== 0) {
      res.send({
        status: 1
      })
    } else {
      res.send({
        status: 0,
        errorMsg: '删除失败！'
      })
    }
  }).catch(function (e) {
    res.send({
      status: 0,
      errorMsg: '数据库异常或者你没有权限'
    });
  });
});

module.exports = router;