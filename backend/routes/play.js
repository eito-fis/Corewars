// express imports
var express = require('express');
var router = express.Router();

// middleware imports
var secured = require('../middleware/secured')

//class imports
var Warrior = require('../models/warrior.model')
var Collection = require('../models/collection.model')


//Below are the get requests for the entire play setup (all the same minus the starting URL's
router.get('/', secured(), (req, res, next)=>{
    const {_raw, _json, ...userProfile} = req.user
        .then(userProfile => res.json(userProfile))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.get('/edit/', secured(), (req, res, next)=>{
    const {_raw, _json, ...userProfile} = req.user
        .then(userProfile => res.json(userProfile))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.get('/new/', secured(), (req, res, next)=>{
    const {_raw, _json, ...userProfile} = req.user
        .then(userProfile => res.json(userProfile))
        .catch(err => res.status(400).json('Error: ' + err))
});


// This actually is creating a new warrior in the warrior database, adding that to the user's collection
router.post('/new/', secured(), (req, res, next)=>{
    // creating the new warrior
    const commandList = req.body.commandList
    const date = Date.parse(req.body.date)

    const newWarrior = new Warrior(commandList, date)

    // pushing to the collection
    const {_raw, _json, ...userProfile} =  req.user
    let collection = userProfile.collection
    collection.push(newWarrior)

    // how do we do this?


})


/* This is editing a pre-existing warrior that'll be displayed in the front end then overwriting the original
in the user's collection
*/

router.post('/edit/', secured(), (req, res, next)=>{



})

module.exports = router