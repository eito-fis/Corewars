// express imports
var express = require('express');
var router = express.Router();

// middleware imports
let secured = require('../middleware/secured')

//class imports
let User = require('../models/user.model')
let Warrior = require('../models/warrior.model')


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

// above only user profile info is needed

// This actually is creating a new warrior in the warrior database, adding that to the user's collection
router.post('/new/', secured(), (req, res, next)=>{

    const {_raw, _json, ...userProfile} =  req.user

    // creates a new warrior with only the command list passed in from the request
    const commandList = req.body.commandList
    const date = new Date()

    const newWarrior = new Warrior(commandList, date)
    // creates new warrior

    // pushing to the collection
    let collection = userProfile.collection
    let newCollection = collection.push(newWarrior)

    // edits the user in question

    // again, this needs to be tested!!! :( LOL
    User.find({user_id: userProfile.user_id.substring(6)}, null, { skip: 10 }) // this is probably not correct
        .then(user=>{
            user.collection = newCollection
            user.save()
                .then(() => res.json('Warrior Added!'))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .err((err)=> res.status(400).json('Error: ' + err))
})


/* This is editing a pre-existing warrior that'll be displayed in the front end then overwriting the original
in the user's collection
*/

router.post('/edit/', secured(), (req, res, next)=>{

    const {_raw, _json, ...userProfile} =  req.user

    // needs to take in a collection index in addition of the list
    // forges a new warrior to overwrite the original one with that index using the command list passed in from the request
    const commandList = req.body.commandList
    const collectionIndex = req.body.index;
    const date = new Date()

    const newWarrior = new Warrior(commandList, date)
    // creates new warrior

    // pushing to the collection
    let collection = userProfile.collection
    collection[collectionIndex] = newWarrior

    // edits the user in question

    // again, this needs to be tested!!! :( LOL
    User.find({user_id: userProfile.user_id.substring(6)}, null, { skip: 10 }) // this is probably not correct
        .then(user=>{
            user.collection = collection
            user.save()
                .then(() => res.json('Warrior Added!'))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .err((err)=> res.status(400).json('Error: ' + err))
})

module.exports = router