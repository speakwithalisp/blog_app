/* import app's mongodb (configured in server.js) and create a schema(?). Set up CRUD operations and appropriate error handlers */
var ObjectID = require('mongodb').ObjectID;
// Users module
var Users = module.exports.Users = function(req){
    var that = {};
    //schema
    that.schema = (function(){
        var that = {};
        that._type = "users";
        that._essential = ['name', 'email'];
        that._unique = ['email'];
        that.body = {};
        //that.name = req? req.body.name : "Clarence";
        //more robust and proper query/body etc methods
        that.body.posts = [];
        that.body.comments = req.body.comments || [];
        if(req.body.name || req.query.name || req.params.name)
            that.body.name = req.body.name || req.query.name || req.params.name;
        if(req.params.id || req.body._id || req.query._id)
            that.body._id = new ObjectID(req.params.id || req.body._id || req.query._id);
        if(req.body.email || req.query.email || req.params.email)
            that.body.email = req.body.email || req.query.email || req.params.email;
        return that;
    }());
    var crudsworth = crudder(that.schema);
    that.create = crudsworth.create();
    that.read = crudsworth.read();
    that.update = crudsworth.update({email:{isId: false}, name:{isId: false}, posts:{isId: true}, comments:{isId: true}});
    that.delete = crudsworth.delete();
    return that;
};
// Posts module
var Posts = module.exports.Posts = function(req){
    var that = {};
    that.schema = (function(){
        var that = {};
        that._type = "posts";
        that._essential = ['createdBy', 'title', 'content'];
        that.body = {};
        if(req.body.createdBy || req.query.createdBy || req.params.createdBy)
            that.body.createdBy = req.body.createdBy || req.query.createdBy || req.params.createdBy;
        if(req.params.id)
            that.body._id = new ObjectID(req.params.id);
        if(req.body.title || req.query.title || req.params.title)
            that.body.title = req.body.title || req.query.title || req.params.title;
        if(req.body.content)
            that.body.content = req.body.content;
        if(req.body.createdAt || req.query.createdAt || req.params.createdAt)
            that.body.createdAt = req.body.createdAt || req.query.createdAt || req.params.createdAt;
        if(req.body.content || req.query.content || req.params.content)
            that.body.content = req.body.content || req.query.content || req.params.content;
        return that;
    }());
    var crudsworth = crudder(that.schema);
    that.create = (function(){
        var myReq = req;
        myReq.body = {};
        myReq.body._id = that.schema.body.createdBy;
        // Return create with a hook that updates our db and takes a closured db variable
        return crudsworth.create(function (db){
        var updateUser = Users(myReq);
        updateUser.schema.body.posts = that.schema.body._id;
        console.log(that.schema);
        console.log(updateUser.schema);
            return updateUser.update(db,function(){console.log("success");});
        });
    }());
    that.read = crudsworth.read();
    that.update = crudsworth.update({title:{isId: false}, content:{isId: false}});
        that.delete = crudsworth.delete();
    return that;
};

var crudder = function(schema){
    var that = {};
    that.create = function(hook){
        return function(db, callback) {
            var crudObject = db.collection(schema._type);
            schema.body.createdAt = new Date().getTime();
            console.log(schema);
            var counter = 0;
            if(schema._unique)
            {schema._unique.forEach(function(key){
                var searchObject = {};
                searchObject[key] = schema.body[key];
                var checker = crudObject.findOne(searchObject);
                if(Object.keys(checker).length === 0 || JSON.stringify(checker) === JSON.stringify({}))
                    counter++;
            });
            }
            if(counter !== 0)
                console.log("email already exists");
            else
            {
                console.log("inserting this object");
            var safe = true;
            // if(Object.keys(schema.body).length !== 0 || JSON.stringify(schema) !== JSON.stringify({}))
            try{
                schema._essential.forEach(function(elt){
                    if (schema.body[elt].length === 0)
                        safe = false;
                    });
            } catch(error){
                safe = false;
            }
            finally{
            console.log(safe);
                if(!safe){
                    console.log("Invalid object");
                    callback();
                }
                else{
            crudObject.insert(schema.body, function(error,result){
                if (error)
                    throw error("Something went wrong");
                else
                {
                    if(hook)
                        hook(db);
                    callback(result);
                }
            });
            }
            }
            }
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
    that.update = function(mapObject){
        return function(db,callback){
            var crudObject = db.collection(schema._type);
            // findOne with given id and, if not found return error code 4xx not found. else update
            if(mapObject)
            {
                var set = {}, push = {};
            Object.keys(mapObject).forEach(function(key){
                if(schema.body[key]){
                    if(mapObject[key].isId === false)
                        set[key] = schema.body[key];
                    else if(mapObject[key].isId === true){
                            push[key] = schema.body[key];
                    }
                }
            });
                console.log(JSON.stringify(push));
                console.log(JSON.stringify(set));
                if(Object.keys(set).length !== 0 && JSON.stringify(set) !== JSON.stringify({}))
                    return crudObject.updateOne({_id: schema.body._id}, {$set: set}, function(error, result){
                    if(error)
                            throw error("Something went wrong");
                        else
                            callback(result);
                    });
                else if(Object.keys(push).length !== 0 && JSON.stringify(push) !== JSON.stringify({}))
                    return crudObject.updateOne({_id: schema.body._id}, {$push: push}, function(error, result){
                        callback(result);
                    });
                else
                    return null;
            }
            else
                return null;
        };
    };
    
    that.delete = function(){
        return function(db,callback){
            var crudObject = db.collection(schema._type);
            // findOne with given id and, if not found return error code 4xx not found. else delete

            var temp = crudObject.findOne({_id: schema.body._id}, function(error,result){
                if (error)
                    throw error("Something went wrong");
                else
                    callback(result);
            });
            if(temp === null)
                throw error("Object not found");
            return crudObject.deleteOne({_id: schema.body._id}, function(error,result){
                if(error)
                    throw error("Nyaah");
                else
                    callback(result);
            });
            
        };
    };
    return that;
};










