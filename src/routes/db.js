var MongoClient = require('mongodb').MongoClient;
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;
var GridStore = require('mongodb').GridStore;
var Grid = require('mongodb').Grid;
var db;
if(process.env.TEST_MODE !== 'on')
    db = module.exports = new Db('newTest', new Server('localhost', 27017),{auto_reconnect: true});
else
    db = module.exports = new Db('testCases', new Server('localhost', 27017), {auto_reconnect: true});
//Set indexes for the three collections


// USERS

db.createCollection('users',{strict:true}).then(function(collection){});

db.collection('users').createIndex({email: 1},{unique: true},  function(err, results) {
    if(err){
        db.close();
    }
    console.log(results);
});

//POSTS

db.createCollection('posts',{strict:true}).then(function(collection){});

db.createIndex('posts', {"createdBy":1, "content": 1},{unique: true, background: true},  function(err, results) {
         console.log(results);
});
// Establish connection to db
db.open(function(err, db) {
    if(err)
        throw err;

});

