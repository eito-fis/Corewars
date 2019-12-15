// const mongoose = require('mongoose')
// const Schema = mongoose.Schema
//
//
// //every single user has this thing.
// const collectionSchema = new Schema({
//     list: {type:Array, required: true},
//     update: {type: Date, required: true}
// })
//
//
//
//
// const Collection = mongoose.model('Collection', collectionSchema)




class Collection {
    constructor(list, dateCreated){
        this.commandList = list
        this.dateCreated = Date.parse(dateCreated)
    }

    // further methods to experiment with?
    addWarrior(warrior){
        this.commandList.push(warrior)
    }

    // init(index, player_id) {
    //     //     this.index = index
    //     //     this.player_id = player_id
    //     // }
}

module.exports = Collection

