var port = 8080; 
var express = require('express');
var child_process = require('child_process');
var spawn = child_process.spawn;
var app = express();
function randint(min, max){ return Math.round(Math.random()*(max-min)+min); }
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testdb',
    password: 'password',
    port: 5432
});

const bodyParser = require('body-parser');
const { stderr } = require('process');
var firstN = 25;


app.use(bodyParser.json());


app.get('/api/getId', function (req, res) {

	let sql = 'INSERT INTO userid(id) VALUES (DEFAULT) RETURNING id;';
	pool.query(sql, [], (err, pgRes) => {
		if (err || pgRes.rowCount != 1) {
			res.status(500).json({"error":'database error'});
			return;
		}
		res.status(200);
		res.json({"id":pgRes.rows[0].id}); 
	});
});


app.get('/api/getNum', function (req, res) {
	if (!"record" in req.query) {
		return res.status(400).json({"error":'Missing required input'});
	}else{
		if(req.query.record<firstN){
			let sql = 'SELECT file_name1, file_name2 from orders where id=$1;';
			pool.query(sql, [req.query.record], (err, pgRes) => {
				if (err || pgRes.rowCount != 1) {
					res.status(500).json({"error":'database error'});
					return;
				}else{
					res.status(200);
					res.json({"num":[pgRes.rows[0].file_name1,pgRes.rows[0].file_name2]}); 
				}	
			});		
		}else{
			res.status(200);
			let n1 = randint(0,98);
			let n2 = randint(0,98);
			while(n1===n2){n2 = randint(0,98);}
			res.json({"num":[n1,n2]}); 
		}
		
	}
});

app.get('/api/getImg', function (req, res) {

    if (!req.headers.authorization) {
		return res.status(403);
  	}else{
        let sql = 'SELECT file_name from images where id=$1;';
		pool.query(sql, [req.headers.authorization], (err, pgRes) => {
			if (err || pgRes.rowCount != 1) {
				res.status(500).json({"error":'database error'});
				return;
			}
			res.status(200).sendFile(__dirname +'/images/' + pgRes.rows[0].file_name);

		});
    }
});

app.put('/api/submit', function (req, res) {

	if (!"pic_num1" in req.body || !"pic_num2" in req.body || !"choice" in req.body|| !"id" in req.body) {
		return res.status(400).json({"error":'Missing required input'});
	}
	var choice = ['left','equal','right'][req.body.choice-1];
	console.log([choice,req.body.pic_num1,req.body.pic_num2, new Date().toISOString(), req.body.id]);
	let sql = 'INSERT INTO votes(id, choice, \"left\", \"right\", study_id, timestamp, voter_uniqueid) VALUES (DEFAULT, $1, $2, $3, 0, $4, $5);';

	pool.query(sql, [choice,req.body.pic_num1,req.body.pic_num2, new Date().toISOString(), req.body.id], (err, pgRes) => {

		if (err) {
			console.log(err.message);
			res.status(500);
			res.json({"error":"database error"});
			return;
		}
		if(pgRes.rowCount == 1){
			res.status(200);
			res.json({"message":"success"}); 
		} else {
			res.status(500);
			res.json({"error":"database error"});
		}
	});

});

app.put('/api/train', function (req, res) {

	if (!"id" in req.body) {
		return res.status(400).json({"error":'Missing required input'});
	}
	spawn('python3',['train.py']).stdout.on('data',function(re,err){
		var result = re.toString();
		
		if(parseInt(result) === 1){
			console.log("finish training");
			res.status(200).json({"message":"success"});
		}else{
			res.status(500).json({"error":'training error'});
		}
	});

});

//Get picture numbers and corresponding model prediction
app.get('/api/getRes', function (req, res) {
	var file1 = '';
	var file2 = '';
	let n1 = randint(0,98);
	let n2 = randint(0,98);
	while(n1===n2){n2 = randint(0,98);}
	let sql = 'SELECT file_name from images where id=$1;';
	pool.query(sql, [n1], (err, pgRes) => {
		file1 = __dirname +'/images/' + pgRes.rows[0].file_name;
		if (err || pgRes.rowCount != 1) {
			res.status(500).json({"error":'database error'});
			return;
		}
	});
	pool.query(sql, [n2], (err, pgRes) => {
		file2 = __dirname +'/images/' + pgRes.rows[0].file_name;
		if (err || pgRes.rowCount != 1) {
			res.status(500).json({"error":'database error'});
			return;
		}
	});
	spawn('python3',['prediction.py',file1,file2]).stdout.on('data',function(re,err){
		var result = re.toString();
		if(parseInt(result)!== NaN){
			console.log([n1,n2,result]);
			res.status(200).json({"num":[n1,n2,parseInt(result)]});
		}else{
			res.status(500).json({"error":'database error'});
		}
	});

});




app.use('/',express.static('static_content')); 

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

