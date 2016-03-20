var router = module.exports = require('./router.js');
var Users = require("../models.js").Users;
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var db = require('./db.js');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

router.param('email', function(req,res,next){
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

router.route('/login')
    .post(function(req,res,next){
        var pass = req.body.password || req.query.password || "";
        var phash = "";
        if(pass === "")
            next(new Error("empty password field"));
        else
        db.open(function (err, db){
            if(err)
                next(err);
            else{
                    console.log("Connected to database");
                res.locals.authUser = Users(req);
                res.locals.authUser.readForPass(db,function(result){
                    phash = result[0].password;
                    bcrypt.compare(pass, phash, function(err,reslt) {
                    if(err)
                        next(err);
                    else
                        {
                            if(result === false)
                                res.json({
                                    success: false,

                                    message: 'password does not match!'

                            });
                            var that = {};
                            Object.keys(result[0]).forEach(function(key){
                                if(key !== 'password')
                                    that[key] = result[key];
                                
                            });
                            var token = jwt.sign(that, 'Ivegotabikeyoucanrideitifyoulike', {
                                expiresIn: 1440*60 // expires in 24 hours

                            });

                            res.json({
                                success: true,
                                message: 'Enjoy your token!',
                                token: token
                            });
                        }
                    });
                });
                }
        });
    });
/*
router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    if(req.method === 'GET')
        next(null);
    else
    {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
        if (token) {

    // verifies secret and checks exp
      jwt.verify(token, 'Ivegotabikeyoucanrideitifyoulike', function(err, decoded) {      
      if (err) {
        res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
    }
});
 */

router.route('/users')
    .all(function (req,res,next){
        // Field validations go here
        next(null);
    })
    .post(function(req,res,next){
        //set req.body.password
        var pass = req.body.password || req.query.password || "";
        if(pass === "")
            next(new Error("empty password field"));
        else
            bcrypt.genSalt(10, function(err, salt) {
                if(err)
                    next(err);
                else
                    bcrypt.hash(pass,salt, function(err, hash) {
                // Store hash in your password DB.
                        req.body.password = hash;
                        next(null);
            });
        });
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
        res.locals.newUser.readOne(db, function(result){
            if(JSON.stringify(result)!== '[]')
                next(new Error("nigga please"));
        });
        next(null);
    })
    .post(function (req, res,next){
        db.collection('users').createIndex({email: 1},{unique: true},  function(err, results) {
            if(err){
                db.close();
                throw err;
            }
    console.log(results);
});
        res.locals.newUser.create(db,function(result){
            console.log("Result is" + JSON.stringify(result.ops[0]));
            var returnUser = {};
            Object.keys(result.ops[0]).forEach(function(key){
                if(key === 'name' || key === 'email' || key === '_id')
                    returnUser[key] = result.ops[0][key];
            });
            
            res.json({message: 'user created!',
                      user: returnUser});
        });
    })
    .get(function(req,res,next){
        console.log(res.locals.newUser.schema);
        res.locals.newUser.read(db,function(result){
            res.json(result);
        });
            
    });

router.route('/users/:email')
    .all(function(req, res,next){
    res.locals.origUser.readOne(db,function(result){
        res.locals.existingUser = result.pop();
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
