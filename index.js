
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const pg = require('pg');


const conString = 'postgres://postgres:123456@localhost/node_hero';
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());


// pg.connect(conString, function (err, client, done) {
//   if (err) {
//     return console.error('error fetching client from pool', err)
//   }
//   client.query('SELECT $1::varchar AS my_first_query', ['node hero'], function (err, result) {
//     done();

//     if (err) {
//       return console.error('error happened during query', err)
//     }
//     console.log(result.rows[0]);
//     process.exit(0);
//   });
// });

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

const users = [];

app.post('/users', function (req, res, next) {
  const user = req.body;
  console.log(req.body);

  pg.connect(conString, (err, client, done) => {
    if (err) {
      // pass the error to the express error handler
      return next(err);
    }
    client.query('INSERT INTO users (name, age) VALUES ($1, $2);', [user.name, user.age], function (err, result) {
      done(); // this done callback signals the pg driver that the connection can be closed or returned to the connection pool

      if (err) {
        // pass the error to the express error handler
        return next(err);
      }

      res.send(200);
    });
  });
});

app.get('/users', function (req, res, next) {
  pg.connect(conString, function (err, client, done) {
    if (err) {
      // pass the error to the express error handler
      return next(err);
    }
    client.query('SELECT name, age FROM users;', [], function (err, result) {
      done();

      if (err) {
        // pass the error to the express error handler
        return next(err);
      }

      res.json(result.rows);
    });
  });
});

app.use((err, request, response, next) => {
  // log the error, for now just console.log
  console.log(err);
  response.status(500).send('Something broke!');
});

app.listen(3000);
