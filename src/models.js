/* import app's mongodb (configured in server.js) and create a schema(?). Set up CRUD operations and appropriate error handlers */
var ObjectID = require('mongodb').ObjectID;
var Users = module.exports = function(req){
    var that = {};
    //schema
    that.schema = (function(){
        var that = {};
        that._type = "users";
        that.body = {};
        //that.name = req? req.body.name : "Clarence";
        //more robust and proper query/body etc methods
        if(req._body && req.query.name)
            that.body.name = req.query.name;
        if(req.params.id)
            that.body._id = new ObjectID(req.params.id);
        if(req._body && req.query.penis)
            that.body.penis = req.query.penis;
        return that;
    }());
    var crudsworth = crudder(that.schema);
    that.create = crudsworth.create();
    that.read = crudsworth.read();
    that.update = crudsworth.update();
    that.delete = crudsworth.delete();
    return that;
};
var crudder = function(schema){
    var that = {};
    that.create = function(){
        return function(db, callback) {
            var crudObject = db.collection(schema._type);
            console.log(schema);
        console.log("inserting this object");
        if(Object.keys(schema.body).length !== 0 || JSON.stringify(schema) !== JSON.stringify({}))
            crudObject.insert(schema.body, function(error,result){
                if (error)
                    throw error("Empty object");
                else
                    callback(result);
            });
    };
    };
    that.read = function(){
        return function(db, callback){
            var crudObject = db.collection(schema._type);
            return crudObject.find(schema.body).toArray(function(err,result){
                callback(result);
            });
        };
    };
    that.update = function(){
        return function(db,callback){
            var crudObject = db.collection(schema._type);
            return crudObject.updateOne({_id: schema.body._id}, {$set: schema.body},function(err,result){
                callback(result);
            });
            
        };
    };
    
    that.delete = function(){
        return function(db,callback){
            var crudObject = db.collection(schema._type);
            return crudObject.deleteMany(schema.body, function(err,result){
                callback(result);
            });
            
        };
    };
    return that;
};










