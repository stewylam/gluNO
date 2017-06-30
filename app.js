const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Sequelize = require('sequelize');
const pug = require('pug');
const db = new Sequelize('postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/gluno');
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: true})); // get information from html forms
app.use(express.static('public'));
app.use(session({
    secret: 'security',
    resave: true,
    saveUninitialized: false
}));

//create tables -- if tables exists, then leave it
db.sync()

////// defines the table, keys and datatypes.

// models
const Restaurant = db.define('restaurant', {
  Name: Sequelize.STRING,
  Address: Sequelize.STRING,
  City: Sequelize.STRING,
  Website: Sequelize.STRING,
  Description: Sequelize.TEXT
});



/*User.hasMany(Restaurant);
Restaurant.belongsTo(User);
User.hasMany(Review);
Review.belongsTo(User);
Restaurant.hasMany(Review);
Review.belongsTo(Restaurant);*/

// add json file to model
fs.readFile('./gluno.json', 'utf-8', function(err, data){
      if (err) {
        throw err;
      }

var restaurants = JSON.parse(data)

for (var i = 0; i < restaurants.length; i++)
    Restaurant.create({
      Name: restaurants[i].Name,
      Address: restaurants[i].Address,
      City: restaurants[i].City,
      Website: restaurants[i].Website,
      Description: restaurants[i].Description
  })
})


/// different routes

//// index
app.get('/', (req, res) => {
    res.render('index'); // information gets passed to PUG and get renders to HTML
});

app.post('/search', (req, res) => {
  let search = req.body.search

  if (search.length === 0) {
    res.render('index', {message: 'Please type in the restaurant name or city to find a restaurant'})
  } 
  else {
    Restaurant.findAll({
      where: {
        $or: [{Name: search},
          {City: search}] 
      }
    })
    .then((result) => {    
      if (result === undefined) {
        res.render('restaurants', {restaurants: result, message: 'Sorry, that restaurant is not in our database'})
      }
      else {
        res.render('search', {search: search, restaurants: result})
        console.log(result)
      }    
    })
  }
});

app.get('/search', (req, res) => {
  res.render('search')
})

app.get('/restaurants', (req, res) => {
  Restaurant.findAll()
  .then((result) => {    
    res.render('restaurants', {restaurants: result})
  })
})


app.post('/add', (req, res) => {
  Restaurant.findOne({
    where: {Name: name}
  })
  .then(restaurant => {
    if(restaurant){
      res.render('index', {messageL: 'This restaurant already exists'})
    }
    else {
      Restaurant.create({
        Name: req.body.Name,
        Address: req.body.Name,
        City: req.body.City,
        Website: req.body.Website,
        Description: req.body.info
      })
      .then(function(restaurants) {
      res.render('restPage', {restaurant: restaurants})
      })
    }
  })
})


app.get('/restaurant', (req, res) => {
  Restaurant.findOne({
    where: {
      id: req.query.id
    }
  })
  .then(result => { 
    res.render('restaurant', {restaurant: result})
  })
});

app.post('')


const server = app.listen(3000, () => {
    console.log('server has started at ', server.address().port)
});