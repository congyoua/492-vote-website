var port = 8000; 
var express = require('express');
var app = express();
function randint(min, max){ return Math.round(Math.random()*(max-min)+min); }
const { Pool } = require('pg')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testdb',
    password: 'password',
    port: 5432
});

const bodyParser = require('body-parser');





app.use(bodyParser.json());


app.get('/api/getId', function (req, res) {

	let sql = 'INSERT INTO userid(id) VALUES (DEFAULT) RETURNING id;';
	pool.query(sql, [], (err, pgRes) => {
		if (err || pgRes.rowCount != 1) {
			res.status(500).json({"error":'database error'});
		}
		res.status(200);
		res.json({"id":pgRes.rows[0].id}); 
	});
});


app.get('/api/getNum', function (req, res) {
	res.status(200);
	res.json({"num":randint(0,99)}); 
});

app.get('/api/getImg', function (req, res) {

    if (!req.headers.authorization) {
		return res.status(403);
  	}else{
        let sql = 'SELECT file_name from images where id=$1;';
		pool.query(sql, [req.headers.authorization], (err, pgRes) => {
			if (err || pgRes.rowCount != 1) {
				res.status(500).json({"error":'database error'});
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

app.use('/',express.static('static_content')); 

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

