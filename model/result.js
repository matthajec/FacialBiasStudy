const mongoose = require('mongoose')
const { Schema } = mongoose

const resultSchema = new Schema({
  email: String,
  pin: Number,
  age: Number,
  answers: [{
    winner: Number,
    loser: Number
  }]
})

module.exports = mongoose.model('Result', resultSchema)