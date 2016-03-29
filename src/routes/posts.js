var router = module.exports = require('./router.js');
//var Users = require("../models.js").Users;
var Posts = require("../models.js").Posts;
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var db = require('./db.js');
var jwt = require('jsonwebtoken');

router.param('id', function(req,res,next){
            db.open(function (err, db){
                if(err)
                    next(err);
                else{
                    console.log("Connected to database");
                    res.locals.origPost = Posts(req);
                    next(null);
                }
            });
});

router.route('/posts')
    .all(function (req,res,next){
        // Field validations go here
        next(null);
    })
    .all(function (req,res,next){
            db.open(function (err, db){
                if(err)
                    next(err);
                else{
                    console.log("Connected to database");
                    res.locals.newPost = Posts(req);
                    next(null);
                }
            });
    })
    .post(function (req, res,next){
        db.collection('posts').createIndex({title: 1, content:1},{unique: true},  function(err, results) {
            if(err){
                db.close();
                throw err;
            }
    console.log(results);
        });
        res.locals.newPost.create(db,function(){
            res.json({message: 'post created!'});
        });
    })
    .get(function(req,res,next){
        console.log(res.locals.newPost.schema);
        res.locals.newPost.read(db,function(result){
            res.json(result);
        });
            
    });

router.route('/posts/:id')
    .all(function(req, res,next){
    res.locals.origPost.read(db,function(result){
        res.locals.existingPost = result;
        next(null);
    });
    })
    .get(function(req, res){
        res.json(res.locals.existingPost);
    }) 
    .put(function(req, res){
        res.locals.origPost.update(db,function(result){
            res.json(result);
                });
    })
    .delete(function(req, res){
      res.locals.origPost.delete(db,function(result){
          res.json(result);
                });
    });
