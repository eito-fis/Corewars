const express = require('express')
const router = express.Router()
var secured = require('../middleware/secured')
let User = require('../models/user.model')

// building the user router

//allows a logged in user to view all users at a certain URL
router.get('viewstudents/', secured(), (req, res, next)=>{
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.get('/', secured(), (req, res, next)=> {
    const {_raw, _json, ...userProfile} = req.user
        .then(userProfile => res.json(userProfile))
        .catch(err => res.status(400).json('Error: ' + err))
})

/*
Below is a users update their profile post route for the API - however, the auth0 and mongodb user models
aren't linked and I'm not sure how to integrate them together.

 */

// router.post('updateprofile/', secured(), (req, res, next)=>{
//     const {_raw, _json, ...userProfile} = req.user
//         .then(userprofile => )
//
//
//     Exercise.findById(req.params.id)
//         .then(exercise => {
//             exercise.username = req.body.username
//             exercise.description = req.body.description
//             exercise.duration = Number(req.body.duration)
//             exercise.date = Date.parse(req.body.date)
//
//             exercise.save()
//                 .then(() => res.json('Exercise updated'))
//                 .catch(err => res.status(400).json('Error: ' + err))
//         })
//         .catch(err => res.status(400).json('Error: ' + err))
// })
//
// })

//right now there is only a view profile and view all.

module.exports = router