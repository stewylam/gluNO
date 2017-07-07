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


//// MODELS
const Restaurant = db.define('restaurant', {
  Name: Sequelize.STRING,
  Address: Sequelize.STRING,
  City: Sequelize.STRING,
  Website: Sequelize.STRING,
  Description: Sequelize.TEXT
});

if(process.argv[2] === "--populate") {
  console.log("populate database")
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
}
else {
  console.log("Is database already populated?")
}

/// ALL RESTAURANTS

////  ROUTE --- index
app.get('/', (req, res) => {
    res.render('index'); // information gets passed to PUG and get renders to HTML
});



///// ROUTE --- SEARCH 
app.get('/search', (req, res) => {
  res.render('search')
})

app.post('/search', (req, res) => {
  let search = req.body.search
  console.log("First search" + search)
  if (search.length === 0) {
    res.render('index', {message: 'Please type in the restaurant name or city to find a restaurant'})
  } 
  if (search === undefined) {
  res.render('index', {message: 'Sorry this restaurant is unknown. Share the tip!'})
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
        console.log("Second search " + search)  
        res.render('search', {search: search, restaurants: result})
      }    
    })
  }
});


///// ADD restaurant
app.post('/add', (req, res) => {
  if (req.body.Name.length === 0 || req.body.Address.length === 0 || req.body.City.length === 0 || req.body.info.length === 0) {
    res.render('index', {messageL: 'Please fill out all information to share the tip'})
  }

  Restaurant.findOne({
    where: {Name: req.body.Name}
  })
  .then(restaurant => {
    if(restaurant){
      res.render('index', {messageL: 'This restaurant already exists'})
    }
    else {
      Restaurant.create({
        Name: req.body.Name,
        Address: req.body.Address,
        City: req.body.City,
        Website: req.body.Website,
        Description: req.body.info
      })
      .then(function(restaurants) {
      res.render('restaurant', {restaurant: restaurants})
      })
    }
  })
})


////// ROUTE --- OVERVIEW RESTAURANTS
app.get('/restaurants', (req, res) => {
    res.render('restaurants')
})


//// ROUTE -- SPECIFIC RESTURANT
app.get('/restaurant', (req, res) => {
  Restaurant.findOne({
    where: {
      id: req.query.id
    }
  })
  .then(result =>{
    res.render('restaurant', {restaurant: result})
  })
});


//// App Listener
const server = app.listen(3000, () => {
    console.log('server has started at ', server.address().port)
});