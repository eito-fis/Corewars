const mongoose = require('mongoose')
const Schema = mongoose.Schema


//every single user has this thing.
const warriorSchema = new Schema({
    list: {type:Array, required: true},
    update: {type: Date, required: true}
})




const Warrior = mongoose.model('WarriorList', warriorSchema)
module.exports = Warrior