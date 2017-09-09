var express = require('express');
var router = express.Router();
var Note=require('../model/note');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/notes/add',function(req,res,next){
  console.log(req);
});

module.exports = router;
