const express = require('express')
const countImages = require('./util/countImages')
const fs = require('fs')

const app = express();


let fileCount = -1; // cache the file count in memory...

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', "*")
  res.set('Access-Control-Allow-Headers', "*")
  next()
})

app.use(express.json())

app.use('/faces', express.static('faces'))
app.use(express.static('client'))


app.get('/image_count', (req, res) => {
  res.status(200).json({ count: fileCount });
})

app.post('/submit', (req, res) => {
  fs.readFile('./database.json', (err, json) => { // the best database, database.json
    try {
      if (err) {
        throw err
      }
      const data = JSON.parse(json)

      data.push({
        name: req.body.name,
        results: req.body.results.slice(0, 4)
      })

      fs.writeFile('./database.json', JSON.stringify(data), new Function)
    } catch (err) {
      return res.status(500).json({ message: err })
    }
  })


})

countImages(count => {
  fileCount = count;
  app.listen(process.env.PORT || 3000);
})

