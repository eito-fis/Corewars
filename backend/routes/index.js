var express = require('express');
var router = express.Router();

var secured = require('../middleware/secured')


/* GET home page.
* This is basiclly going to return a bunch of values about the user, the play time, etc.
* There are no other API methods than the get method.
* */

router.get('/', secured(),function (req, res, next) {
    // grabbing user information
    const {_raw, _json, ...userProfile} = req.user
        .then(userProfile => res.json(userProfile))
        .catch(err => res.status(400).json('Error: ' + err))
});




module.exports = router;