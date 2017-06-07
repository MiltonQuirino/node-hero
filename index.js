const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, './app/views/layouts'),
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, './app/views'));

app.get('/', (request, response) => {
  response.render('home', {
    name: 'John',
  });
});

app.use((err, request, response, next) => {
  // log the error, for now just console.log
  console.log(err);
  response.status(500).send('Something broke!');
});

app.listen(3000);
