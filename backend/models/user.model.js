const mongoose = require('mongoose')
const Schema = mongoose.Schema


// All Users have these attributes
const userSchema = new Schema({
    // Not sure how to connect to the Autho0 schema :)
        username: {type: String, required:true},
        email: {type: String, required: false},
        dateCreated: {type: Date, required: true},
        level: {type: Number, required: true},
        totalPlayTime: {type: Number, required: true},
        collection: {type: Array, required: true},
        lastPlayed: {type: Date, required: true},
    },
    {timestamps: true,}
)


const User = mongoose.model('User', userSchema)
module.exports = User