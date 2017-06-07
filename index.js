const express = require('express');

const app = express()

app.use((request, response, next) => {  
  console.log(request.headers);
  next();
})

app.get('/', (request, response) => {  
  response.json({
    chance: request.chance,
  });
});

app.listen(3000);
