var express = require('express');
var router = express.Router();
//var gen = require('/helpers/generator');

var title = "Generate"

/* GET home page. */
router.get('/:category/:type', function(req, res, next) {
  res.render('generator', { title: title });
  console.log(req.params.category + ' ' + req.params.type);
});

/* GET home page. */
router.get('/:chapter', function(req, res, next) {
  res.render('generator', { title: title });
  console.log(req.params.category );
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('generator', { title: title });
});

module.exports = router;
