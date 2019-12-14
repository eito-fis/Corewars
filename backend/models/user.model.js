const mongoose = require('mongoose')
const Schema = mongoose.Schema

var Collection =  require('collection.model')

//every single user has this thing.
const userSchema = new Schema({
        dateCreated: {type: Date, required: true},
        totalPlayTime: {type: Number, required: true},
        collection: {type: Collection, required: true},
        lastPlayed: {type: Date, required: true},
    },
    {timestamps: true,}
)




const User = mongoose.model('User', userSchema)
module.exports = User