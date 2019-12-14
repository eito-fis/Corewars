//is this useful at all??

var express = require('express');
var router = express.Router();

var secured = require('../middleware/secured')


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Auth0 Webapp sample Nodejs' });
});

module.exports = router;