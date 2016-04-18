var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'qGen' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'qGen | About' });
});

/* GET about page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'qGen | Contact' });
});


router.get('/templates/:name', function (req, res)
 { var name = req.params.name;
   res.render('partials/templates/' + name);
});

module.exports = router;
