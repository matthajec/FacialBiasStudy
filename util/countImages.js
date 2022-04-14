const fs = require('fs');

const dir = './faces';

module.exports = (cb) => {
  fs.readdir(dir, (err, files) => {
    cb(files.length);
  })
}