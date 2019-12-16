const express = require('express')
const router = express.Router()
var secured = require('../middleware/secured')
let User = require('../models/user.model')

// building the user router

//allows a logged in user to view all users at a certain URL
//this is not secured below
router.get('/viewstudents', (req, res, next)=>{
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.get('/', secured(), (req, res, next)=> {
    const {_raw, _json, ...userProfile} = req.user
        .then(userProfile => res.json(userProfile))
        .catch(err => res.status(400).json('Error: ' + err))
})


router.get('/updateprofile', secured(), (req, res, next)=> {
    const {_raw, _json, ...userProfile} = req.user
        .then(userProfile => res.json(userProfile))
        .catch(err => res.status(400).json('Error: ' + err))
})

/*
Below is a users update their profile post route for the API, and a create a new user API  - however, the auth0 and mongodb user models
aren't linked and I'm not sure how to integrate them together.

 */

/*
How to grab data IN REACT COMPONENTS
https://mongoosejs.com/docs/api.html#model_Model.find
maybe throw some nulls in there too below
User.find({user_id: userProfile.user_id})
 */

// how do i make this secured??? well shit
router.post('/createnewuser', (req,res, next)=>{
    const nickname = req.body.nickname
    const emails = req.body.emails
    const user_id = req.body.user_id
    const dateCreated = req.body.dateCreated
    const level = req.body.level
    const totalPlayTime = req.body.totalPlayTime
    const collection = req.body.collection
    const lastPlayed = req.body.lastPlayed

    const newUser = new User({nickname, emails, user_id, dateCreated, level, totalPlayTime, collection, lastPlayed})

    newUser.save()
        .then(() => res.json('User Added biatch'))
        .catch(err => res.status(400).json('Error' + err))

})




// updating profile for users (not for js sandbox, cause that shit's annoying)
router.post('/updateprofile', secured(), (req, res, next)=>{

    //grabbing user data
    const {_raw, _json, ...userProfile} = req.user

    User.find({user_id: userProfile.user_id}, null, { skip: 10 }) // this is probably not correct
        .then(user => {
            user.username = req.body.username
            user.description = req.body.description
            user.duration = Number(req.body.duration)
            user.date = Date.parse(req.body.date)

            user.save()
                .then(() => res.json('User Profile updated'))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(400).json('Error: ' + err))
})



//right now there is only a view profile and view all.







module.exports = router