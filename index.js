const fs = require('fs');

function stats(file) {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

Promise.all([
  stats('index.js'),
  stats('file.md'),
  stats('package.json'),
])
  .then(data => console.log(data))
  .catch(err => console.log(err));
