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
}, {
  timestamps: true
})

module.exports = mongoose.model('Result', resultSchema)
