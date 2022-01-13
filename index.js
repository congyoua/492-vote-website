var port = 8000; 
var express = require('express');
var fs = require('fs');
var base64Img = require('base64-img');
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





app.get('/api/getNum', function (req, res) {
	res.status(200);
	res.json({"num":randint(1,7)}); 
});

app.get('/api/getImg', function (req, res) {

    if (!req.headers.authorization) {
		return res.status(403);
  	}else{
        
	    res.sendFile(__dirname +'/images/' + req.headers.authorization + '.JPG');
    }
});

app.put('/api/submit', function (req, res) {

	if (!"pic_num1" in req.body || !"pic_num2" in req.body || !"choice" in req.body) {
		return res.status(400).json({"error":'Missing required input'});
	}

	console.log(req.body);
});

app.use('/',express.static('static_content')); 

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

