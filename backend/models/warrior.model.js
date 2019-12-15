// const mongoose = require('mongoose')
// const Schema = mongoose.Schema
//
//
// //every single user has this thing.
// const warriorSchema = new Schema({
//     commandList: {type:Array, required: true},
//     updatedDate: {type: Date, required: true}
//     },
//     {timestamps: true,}
//     )
//
//
//
//
// const Warrior = mongoose.model('Warrior', warriorSchema)




class Warrior {
    constructor(commandList, dateCreated) {
        this.commandList = commandList
        this.dateCreated = Date.parse(dateCreated)
        this.matchesWon = 0
        this.matchesLost = 0
    }

    // Other methods

    updateMatchrecord(winBoolean) {
        if (winBoolean) {
            this.matchesLost += 1
        } else {
            this.matchesLost += 1
        }
    }

    updateCommandList(newCommandList) {
        this.commandList = newCommandList
    }
}


module.exports = Warrior