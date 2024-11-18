const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    name: String,
    cost: String,
    type: String,
    set: String,
    rarity: String,
    keywords: String,
    specialrules: String,
    pt: String,
    flavorText: String,
    isCommanderLegal: Boolean,

})

const Card = mongoose.model('Card', cardSchema)

module.exports = Card