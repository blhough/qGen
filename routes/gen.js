var express = require('express');
var router = express.Router();
//var gen = require('/helpers/generator');

var title = "Generate";

var question = "A {object1:[water_vehicle,ball]} is traveling {direction1:[cardinal_direction,ordinal_direction]} at {velocity:(1,20),unit:velocity}. A sudden gust of wind gives the {object1} an acceleration of {acceleration:( .2, 2 ),unit:acceleration}, {direction2:(0,360):units:degree} north of east. What is the {object1}’s velocity {time:(2,30),unit:second} when the wind stops?";


var parseQuestion = function( question ){
    var sub_reg = /\{.+?\}/g;
    var subs = question.match( sub_reg )
   
    return subs;
}




/* GET home page. */
router.get('/:category/:type', function(req, res, next) {
    var subs = parseQuestion( question );
    console.log(subs);
  res.render('generator', { title: title , subs: subs });
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
