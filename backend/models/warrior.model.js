const mongoose = require('mongoose')
const Schema = mongoose.Schema


//every single user has this thing.
const warriorSchema = new Schema({
    list: {type:Array, required: true},
    updatedDate: {type: Date, required: true}
    },
    {timestamps: true,}
    )




const Warrior = mongoose.model('Warrior', warriorSchema)
module.exports = Warrior