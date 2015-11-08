//project set up 
require('./db'); 
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

//retrieve the mongoose movie
var Movie = mongoose.model('Movie');


//route handler that accepts requests for /movies
//callback is used to find movies from the database
 
 app.get('/movies', function (req, res)  {

 	if (req.query.director == undefined || req.query.director == "") {

 		Movie.find({}, function (err, movies, count) {
 		res.render('form', {movies:movies, director: 'All directors'});
 		});
 	}
 	else {

 		Movie.find({director: req.query.director}, function (err, movies, count) {
 		res.render('form', {movies:movies, director: req.query.director});
 		});

 	}
 });

 app.listen(3000);
 console.log('Listening on port 3000');