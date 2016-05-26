

 // console.log("box is checked setting variable to true");
var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('databases/words.sqlite');


// router.get('/isCase/:case', function(req, res, next) {

//  test =req.params.case || false;
// console.log("in route for caseSensitive" + test);
// db.run("PRAGMA case_sensitive_like = " + test);
// router.get('/', function(req, res, next) {
// 	var count = 0;
// 	db.get("SELECT COUNT(*) AS tot FROM words", function(err, row) {
// 		var respText = "Words API: " + row.tot + " words online.";
// 		res.send(respText);
// 	});
// });


// });

router.get('/', function(req, res, next) {
	var count = 0;
	db.get("SELECT COUNT(*) AS tot FROM words", function(err, row) {
		var respText = "Words API: " + row.tot + " words online.";
		res.send(respText);
	});
});



router.get('/count/:abbrev', function(req, res, next) {


	var abbrev = req.params.abbrev;

	var test= req.query.case;
	console.log("inside  count route " + abbrev);


	if(test)
{
	console.log(test);
db.run("PRAGMA case_sensitive_like = " + test);
}
	// 	var data = {};
	// 	var sql = "SELECT COUNT(*) AS wordcount FROM words WHERE word LIKE '" + abbrev + "%'"
	// 	db.get(sql, function(err, row) {
	// 		data.abbrev = abbrev;
	// 		data.count = row.wordcount;
	// 		res.send(data);
	// 	});

	var alen = abbrev.length;
	var dataArray = [];
	var sql = "SELECT substr(word,1," + alen + "+1) AS abbr, " + " count(*) AS wordcount FROM words " + " WHERE word LIKE '" + abbrev + "%'" + " GROUP BY substr(word,1," + alen + "+1)"
	db.all(sql, function(err, rows) {
		for (var i = 0; i < rows.length; i++) {
			dataArray[i] = {
				abbrev: rows[i].abbr,
				count: rows[i].wordcount
			};
		}
		res.send(dataArray); //Express will stringify data, set Content-type });
	});
});

router.get('/search/:abbrev', function(req, res, next) {
	var abbrev = req.params.abbrev;

	var test= req.query.case;
	var threshold = req.query.threshold;

//	console.log("the url has been split, the values are :  abbrev : " +abbrev + " threshold: "  +threshold + "case : " + test);
if(test)
{
	console.log(test);
db.run("PRAGMA case_sensitive_like = " + test);
}

if (threshold && abbrev.length < Number(threshold)) {
res.status(204).send() ;
return;

}



	var query = ("SELECT id, word FROM words " + " WHERE word LIKE '" + abbrev + "%' ORDER BY word ");
	db.all(query, function(err, data) {
		if (err) {
			res.status(500).send("Database Error");
		} else {
			console.log("test to see where return goes");
			res.status(200).json(data);
			console.log("this should not print");
		}
	});
});

module.exports = router;
