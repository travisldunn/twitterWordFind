// console.log("box is checked setting variable to true");



var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('databases/words.sqlite');
var Twitter = require('twitter');
var credentials = require("../.credentials.js");
var twitParams = credentials.twitParams;
console.log("screenNamr" +twitParams);
var twitClient = new Twitter(credentials.twitCredentials);

router.get('/', function(req, res, next) {
	var count = 0;
	db.get("SELECT COUNT(*) AS tot FROM words", function(err, row) {
		var respText = "Words API: " + row.tot + " words online.";
		res.send(respText);
	});
});



router.get('/find/:id', function(req, res, next) {
	console.log("in route for search by id ");
	var idtest = req.params.id;
	console.log("id " + idtest);
	var query1 = "SELECT id, word FROM words where id = " + idtest;
	db.get(query1, function(err, row) {

	res.wordData = row;
			// res.json(row);
		next();

	});
});

router.get('/find/:id', function(req, res, next) {
	console.log("res  in twitter route:" + res.wordData);
	var word = res.wordData.word;
res.wordData.twitter = {};
var twitSearch = "https://api.twitter.com/1.1/search/tweets.json?";

twitSearch +="q=";
twitSearch +="lang%3Aen%20"  //language en
twitSearch +="%23" + word;
twitSearch +="&result_type=recent";
console.log("console twitter search " +twitSearch);
console.log("twit parrams " +twitParams.screen_name);
twitClient.get(twitSearch, twitParams,function (error, tweets, response) {

console.log("Test");
 if(error) {

console.log("Twitter Fail");
console.log(error);
 }
 else {
 	res.wordData.twitter = tweets;
console.log("Twitter Found, succes " + tweets+ (res.wordData.twitter));
 }
 res.status(200).json(res.wordData);
});



});



router.delete('/delete/:id/:word', function(req, res, next) {
	console.log("in route to delete by id ");
	var idtest = req.params.id;
	var wordtest = req.params.word;
	console.log("id " + idtest);


	var query1 = "delete FROM words where id = " + idtest;
	db.run(query1, function(err) {
		console.log(query1);
		if (err) {
			res.status(500).send("Database Error");
		} else {
			res.status(202).send();
		}
	});

});

router.put('/update/:id', function(req, res, next) {
	console.log("in route to update by id ");
	var idtest = req.params.id;
	var wordtest = req.body.word;
	var wordtest1 = req.body.word1;

	console.log("id " + idtest + wordtest);


	var query1 = "UPDATE words SET word = '" + wordtest + "' where id = " + idtest;
	db.run(query1, function(err) {
		console.log(query1);
		if (err) {
			res.status(500).send("Database Error");
		} else {
			resOBJ ={};
			resOBJ.word = wordtest;
			resOBJ.word1 = wordtest1;
			console.log("result is " +resOBJ);
			res.status(202).send(resOBJ);
		}
	});

});

router.post('/create/:word', function(req, res, next) {
		console.log("in route to create word ");
		var wordtest = req.params.word;
		console.log(wordtest);


		var query1 = "INSERT INTO words (word) VALUES ('" + wordtest + "')";
		db.run(query1, function(err) {
				console.log(query1);
				if (err) {
					res.status(500).send("Database Error");
				} else {

					var wordTemp = {};
					wordTemp.id = this.lastID;
					wordTemp.word = wordtest;
					console.log("val  " + this.lastID);
				}
				res.status(202).send();
			});


});


router.get('/search/:abbrev', function(req, res, next) {

	console.log("in search route");
	var abbrev = req.params.abbrev;

	var test = req.query.case;
	var threshold = req.query.threshold;

	//	console.log("the url has been split, the values are :  abbrev : " +abbrev + " threshold: "  +threshold + "case : " + test);
	if (test) {
		console.log(test);
		db.run("PRAGMA case_sensitive_like = " + test);
	}

	if (threshold && abbrev.length < Number(threshold)) {
		res.status(204).send();
		return;

	}
	var query = ("SELECT id, word FROM words " + " WHERE word LIKE '" + abbrev + "%' ORDER BY word ");
	db.all(query, function(err, data) {
		if (err) {
			res.status(500).send("Database Error");
		} else {

			res.status(200).json(data);

		}
	});
});

module.exports = router;
