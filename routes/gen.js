var express = require('express');
var router = express.Router();
//var gen = require('/helpers/generator');

/* GET home page. */
router.get('/:category/:type', function(req, res, next) {
  res.render('generator', { questions: ["how fast is the ball going?","what color is the light?"] });
  console.log(req.params.category + ' ' + req.params.type);
});

/* GET home page. */
router.get('/:category', function(req, res, next) {
  res.render('index', { title: 'test test' });
  console.log(req.params.category );
});


/* GET home page. */
router.get('/gen/test', function(req, res, next) {
  res.render('index', { title: 'test gen' });
});

module.exports = router;
