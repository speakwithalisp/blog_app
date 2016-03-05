var http = require('http');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var router = express.Router();
//var cookie-session, cookie-parser, session

var app = express();
var Users = require("./src/models.js");
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
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
router.route('/users')
    .post(function (req, res){
        MongoClient.connect("mongodb://localhost:27017/newTest", function(error, db){
            if(error)
                throw error;
            else{
                console.log("Connected to database");
                var newUser = Users(req);
                console.log(newUser.schema);
                newUser.create(db,function(){
                    db.close();
                });
            }
            
        });
        res.json({message: 'user created!'});
    })
    .get(function(req,res){
        MongoClient.connect("mongodb://localhost:27017/newTest", function(error, db){
            if(error)
                throw error;
            else{
                console.log("Connected to database");
                var newUser = Users(req);
                console.log(newUser.schema);
                newUser.read(db,function(result){
                    db.close();
                    res.json(result);
                });
            }
            
        });
    });

router.route('/users/:id')
    .get(function(req, res){
 MongoClient.connect("mongodb://localhost:27017/newTest", function(error, db){
            if(error)
                throw error;
            else{
                console.log("Connected to database");
            var newUser = Users(req);
                console.log(newUser.schema);
                newUser.read(db,function(result){
                    db.close();
                    res.json(result);
                });
            }
            
        });
    })
    .put(function(req, res){
 MongoClient.connect("mongodb://localhost:27017/newTest", function(error, db){
            if(error)
                throw error;
            else{
                console.log("Connected to database");
            var newUser = Users(req);
                console.log(newUser.schema);
                newUser.update(db,function(result){
                    db.close();
                    res.json(result);
                });
            }
            
        });
    })
    .delete(function(req, res){
 MongoClient.connect("mongodb://localhost:27017/newTest", function(error, db){
            if(error)
                throw error;
            else{
                console.log("Connected to database");
            var newUser = Users(req);
                console.log(newUser.schema);
                newUser.delete(db,function(result){
                    db.close();
                    res.json(result);
                });
            }
            
        });
    });



app.use('/api', router);

app.listen(port, function () {
  console.log('App listening on port!'+ port);
});
















