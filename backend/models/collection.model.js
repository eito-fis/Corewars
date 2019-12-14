const mongoose = require('mongoose')
const Schema = mongoose.Schema


//every single user has this thing.
const collectionSchema = new Schema({
    list: {type:Array, required: true},
    update: {type: Date, required: true}
})




const Collection = mongoose.model('Collection', collectionSchema)
module.exports = Collection

