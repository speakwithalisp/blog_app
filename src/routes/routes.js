var morgan = require('morgan');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
//var cookie-session, cookie-parser, session

var app = module.exports = require('../app.js');
var router = require('./router.js');
var userRoutes = require('./users.js');
var postRoutes = require('./posts.js');
var MongoClient = require('mongodb').MongoClient;
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;
var GridStore = require('mongodb').GridStore;
var Grid = require('mongodb').Grid;
var db = require('./db.js');
/*        MIDDLEWARE 

configure app to use bodyParser()
this will let us get the data from a POST */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port


app.use(morgan('dev'));

app.use(express.static('public'));

app.get('/', function(req, res){
    res.send("Text");
});
app.use('/api', router);

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});









