var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'qGen' });
});

/* GET home page. */
router.get('/gen', function(req, res, next) {
  res.render('index', { title: 'genearting' });
});

module.exports = router;
