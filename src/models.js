/* import app's mongodb (configured in server.js) and create a schema(?). Set up CRUD operations and appropriate error handlers */

var ObjectID = require('mongodb').ObjectID;
// Users module
var Users = module.exports.Users = function(req){
    var that = {};
    //schema
    that.schema = (function(){
        var that = {};
        that._type = "users";
        that._essential = ['name', 'email', 'password'];
        that._updatable = ['name', 'posts', 'comments'];
        that.body = {};
        //more robust and proper query/body etc methods
        //IMPORTANT change the posts handling immediately
        that.body.posts = req.body.posts || [];
        that.body.comments = req.body.comments || [];
        that.body.password = req.body.password; 
        if(req.body.name || req.query.name || req.params.name)
            that.body.name = req.body.name || req.query.name || req.params.name;
        if(req.params.id || req.body._id || req.query._id)
            that.body._id = new ObjectID(req.params.id || req.body._id || req.query._id);
        if(req.body.email || req.query.email || req.params.email)
            that.body.email = req.params.email || req.body.email || req.query.email;
        return that;
    }());
    var crudsworth = crudder(that.schema);
    that.create = crudsworth.create();
    that.read = crudsworth.read({},{password:0});
    that.readOne = crudsworth.read({email: that.schema.body.email},{password:0});
    that.readForPass = crudsworth.read({email: that.schema.body.email});
    that.update = crudsworth.update();
    that.delete = crudsworth.delete();
    return that;
};

var Posts = module.exports.Posts = function(req){
    var that = {};
    that.schema = (function(){
        var that = {};
        that._type = "posts";
        that._essential = ['createdBy', 'title', 'content'];
        that._updatable = ['title','content'];
        that.body = {};
        if(req.decoded)
            that.body.createdBy = req.decoded.email;
        /*if(req.body.createdBy || req.query.createdBy || req.params.createdBy)
            that.body.createdBy = req.body.createdBy || req.query.createdBy || req.params.createdBy; */
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
    that.create = crudsworth.create(function(db,callback){
        var userReq = {};
        userReq.params = {};
        userReq.query = {};
        userReq.body = {email: that.schema.body.createdBy};
        var author = Users(userReq);
        author.readOne(db, function(result){
            var user = result.pop();
            user.posts.push(that.schema.body._id);
            console.log(user);
            Users({body: user, req: {}, params: {}}).update(db, function(resl){callback(resl);});
        });

        /*user.forEach(function(elt){console.log(elt);});
         console.log(user.posts); */
        
    });
    that.read = crudsworth.read({});
    that.update = crudsworth.update();
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
                console.log("inserting this object");
            var safe = true;
            // if(Object.keys(schema.body).length !== 0 || JSON.stringify(schema) !== JSON.stringify({}))
            try{
                schema._essential.forEach(function(elt){
                    if (schema.body[elt].length === 0)
                        safe = false;
                    });
            } catch (error){
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
                    throw error;
                else
                {
                    if(typeof(hook) !== 'function')
                        callback(result);
                }
            });
                    if(typeof(hook) === 'function')
                        hook(db, callback);
            }
            }
    };
    };
    that.read = function(toRead, options){
        return function(db, callback){
            var crudObject = db.collection(schema._type);
            if(!options)
                options = {};
            return crudObject.find(toRead, options).toArray(function(err,result){
                if(err)
                    throw err;
                callback(result);
            });
        };
    };
    that.update = function(){
        return function(db,callback){
            var crudObject = db.collection(schema._type);
            // findOne with given id and, if not found return error code 4xx not found. else update
            var set = {};
            schema._updatable.forEach(function(key){
                if(schema.body[key])
                    set[key] = schema.body[key];
                
            });
            console.log(JSON.stringify(set));
            if(Object.keys(set).length !== 0 && JSON.stringify(set) !== JSON.stringify({}))
                return crudObject.updateOne({email: schema.body.email}, {$set: set}, function(error, result){
                if(error)
                    throw error;
                else
                    callback(result);
                });
            else
                return error;
        };
    };
    
    that.delete = function(hook){
        return function(db,callback){
            var crudObject = db.collection(schema._type);
            // findOne with given id and, if not found return error code 4xx not found. else delete
            return crudObject.deleteOne({email: schema.body.email}, function(error,result){
                if(error)
                    throw error;
                else
                    if(hook)
                        hook();
                    callback(result);
            });
            
        };
    };
    return that;
};
