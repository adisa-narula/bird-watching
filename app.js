//list of bird objects 

var birdList = [

	// {'name': 'Bald Eagle', 'number':3}, 
	// {'name': 'Yellow Billed Duck', 'number':7},
	// {'name': 'Great Cormorant', 'number':4}

	{ 'Bald Eagle': 3 }, 
	{ 'Yellow Billed Duck': 7},
	{ 'Great Cormorant': 4}
];


//setting up required modules
var express = require('express');
var app = express();
//set default layout for handlebar 
var handlebars = require('express3-handlebars').create({ defaultLayout:'main'});
var bodyParser = require('body-parser');
var session = require('express-session');

//set port to 3000
app.set('port', process.env.PORT || 3000);

//set up view engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended:false})); //encoding form 

app.use(express.static(__dirname + '/public'));

//sessions 

var sessionOptions = {

	secret: 'secret cookie',
	resave: true,
	saveUninitialized:true
};

app.use(session(sessionOptions));

//routing

app.use(function (req, res, next) {

	console.log(req.method, req.path);
	console.log("=====");
	console.log("req.body:" , req.body);
	console.log("req.session.minValue:", req.session.minValue);
	console.log();
	next();

});

app.get('/', function (req, res) {

	res.render('home');
});

app.get('/birds', function (req, res) {

	//create a new birdlist 
	var newBirdList = [];

	if (req.session.minValue == undefined) {

		newBirdList = birdList;
		// firstround = false; //no longer the first round
	}

	//create a new array to post on the page
	for (var i = 0; i < birdList.length; i++) {
		for (var keys in birdList[i]) {
			if (birdList[i][keys]  >= +req.session.minValue) {
				newBirdList.push(birdList[i]);
			}
		}
	}
	res.render('bird', {bird: newBirdList});
	
});

app.post('/birds', function (req, res) {

	var newBird = req.body.name;
	var foundBird = false;

	for (var i = 0; i < birdList.length; i++) {

		//check whether the bird is already in the object
		if (newBird in birdList[i]) {

			birdList[i][newBird] += 1; //add one
			foundBird = true;
		}
	}

	if (foundBird == false) {

		//did not find the bird create a new object
		var obj = {};
		obj[newBird] = 1;
		birdList.push(obj);
	}
	res.redirect('/birds');
});

app.get('/settings', function (req, res) {

	res.render('settings', {minimumValue : req.session.minValue});

});

app.post('/settings', function (req, res) {

	req.session.minValue = req.body.minVal;
	//saving data in session 
	// console.log(req.session.minValue);
	res.redirect('/birds'); //redirect to birds 
});

app.listen(app.get('port'), function(){
console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
    });