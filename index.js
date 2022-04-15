const fs = require('fs')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const countImages = require('./util/countImages')
const Result = require('./model/result')

const fileCount = 5749; // how many faces there ares
const app = express();

app.use((req, res, next) => { // cors
  res.set('Access-Control-Allow-Origin', "*")
  res.set('Access-Control-Allow-Headers', "*")
  next()
})
app.use(express.json()) // parse json request body
app.use('/faces', express.static('faces')) // serve face images
app.use(express.static('client')) // serve front end app

app.get('/image_count', (req, res) => { // used for the front end to know the range of valid image ids.
  res.status(200).json({ count: fileCount });
})

app.post('/submit', (req, res, next) => {
  const {
    email,
    pin,
    age,
    answers
  } = req.body

  if (!email || typeof (email) !== 'string' || email.length > 100) {
    return res.status(400).json({ message: "Invalid Email" })
  }

  if (!pin || typeof (pin) !== 'string' || pin.length != 4) {
    return res.status(400).json({ message: "Invalid Pin" })
  }

  if (typeof (age) !== 'number' || age > 125 || age < 0) {
    return res.status(400).json({ message: "Invalid Age" })
  }

  if (!answers || !Array.isArray(answers) || answers.length !== 20) {
    return res.status(400).json({ message: "Invalid answers" })
  }

  answers.forEach(a => {
    if (!a.winner || typeof (a.winner) !== 'number') {
      return res.status(400).json({ message: "Invalid answer" })
    }

    if (!a.loser || typeof (a.loser) !== 'number') {
      return res.status(400).json({ message: "Invalid answer" })
    }
  })

  try {
    const result = new Result({
      email,
      pin,
      age,
      answers
    })

    result.save();
  } catch (err) {
    next(err)
  }
})

// error handler...
app.use((err, req, res, next) => {
  console.log('[ERROR] ' + err.stack)
  res.status(err.status || 500).json({ message: "An error has occured." })
})


mongoose.connect(process.env.DB_URI, (err) => {
  if (err) {
    return console.log("[ERROR] " + err)
  }
  app.listen(process.env.PORT || 3000)
})


