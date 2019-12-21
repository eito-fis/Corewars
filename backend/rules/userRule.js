import axios from 'axios'
//import mongoose?/
// const mongoose = require('mongoose@5.6.11')
const db = require('mongodb@3.1.4')



// userRule.js
// let User = require('../models/user.model')


function(user, context, callback) {

    // make a get call to API, grab all data
    const userList = axios.get(process.env.DOMAIN + '/users/viewstudents')

    // conditional statement
    // does this below work?
    db.userList.find({user_id: user.user_id})
        .then(()=> {
            return callback(null, user, context);
        })
        .catch(()=>{
            const nickname = user.nickname
            const emails = user.email
            const user_id = user.user_id.substring(6)
            const dateCreated = user.created_at
            const level = 1
            const totalPlayTime = 0
            const collection = []
            const lastPlayed = user.created_at

            // set new user
            const newUser = {nickname, emails, user_id, dateCreated, level, totalPlayTime, collection, lastPlayed}

            // make an axios post request to submit new user
            axios.post(process.env.DOMAIN + '/users/createnewuserunsecured', newUser)

            //check nonempty rules
            return callback(null, user, context);
        })


}

