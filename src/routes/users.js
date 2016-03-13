var router = module.exports = require('./router.js');
var Users = require("../models.js").Users;
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var db = require('./db.js');

router.param('id', function(req,res,next){
            db.open(function (err, db){
                if(err)
                    next(err);
                else{
                    console.log("Connected to database");
                    res.locals.origUser = Users(req);
                    next(null);
                }
            });
});

router.route('/users')
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
                    res.locals.newUser = Users(req);
                    next(null);
                }
            });
    })
    .post(function(req,res,next){
        // Get all users and check if email is unique
        next(null);
    })
    .post(function (req, res,next){
        res.locals.newUser.create(db,function(){
            res.json({message: 'user created!'});
        });
    })
    .get(function(req,res,next){
        console.log(res.locals.newUser.schema);
        res.locals.newUser.read(db,function(result){
            res.json(result);
        });
            
    });

router.route('/users/:id')
    .all(function(req, res,next){
    res.locals.origUser.read(db,function(result){
        res.locals.existingUser = result;
        next(null);
    });
    })
    .get(function(req, res){
        res.json(res.locals.existingUser);
    }) 
    .put(function(req, res){
        res.locals.origUser.update(db,function(result){
            res.json(result);
                });
    })
    .delete(function(req, res){
      res.locals.origUser.delete(db,function(result){
          res.json(result);
                });
    });
