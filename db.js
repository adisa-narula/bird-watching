var mongoose = require('mongoose');

var Movie = new mongoose.Schema({
	title:String,
	year:Number,
	director:String,
});

//register the model 
mongoose.model('Movie', Movie);

//connect to the database

mongoose.connect('mongodb://localhost/hw05');