process.env.TEST_MODE = "on";
var expect = require('expect.js');
var assert = require('assert');
var request = require('supertest');
var jwt = require('jsonwebtoken');
var app = require('../src/routes/routes.js');

describe('express rest api server for Posts CRUD', function(){
    var token;

    describe('Creates testing structure', function() {
        

        it('checks for empty users collection', function(done){
request(app)
            .get('/api/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err,res){
                expect(res.body).to.be.empty()
                done()
            })
  })


        it('checks for empty posts collection', function(done){
request(app)
            .get('/api/posts')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err,res){
                expect(res.body).to.be.empty()
                done()
            })
  })


        it('posts users object', function(done){
request(app)
    .post('/api/users')
    .send({name: 'John',
           email: 'test@test.com',
           password:'supercalifragilistest'})
            .end(function(err, res){
                expect(res.body.user).to.only.have.keys(['name', 'email','_id'])
              done() 
    })

        })

        it('posts users object', function(done){
request(app)
    .post('/api/users')
    .send({name: 'Johnny',
           email: 'test@test1.com',
           password:'supercalifragilistest'})
                .end(function(err, res){
                    if(err)
                        done(err)
                    else{
                        expect(res.body.user).to.only.have.keys(['name', 'email','_id'])
              done() 
                    }
    })
        })
        it('logs in to first account', function(done){
            request(app)
                .post('/api/login')
                .send({email: 'test@test.com',
                       password: 'supercalifragilistest'})
                .set('Accept', 'application/json')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function (err, res) {
                    token  = res.body.token;
                    done()
                })
        })
        it("posts a post as user 1", function(done){
            request(app)
                .set('x-access-token', token)
                .post('/api/posts')
                .send({title: "Imma big dumbdumb",
                       content: {
                           sub1: "Gentlemen, as you all know, I am the type of dumb-dumb who is a sir amongst men. I am a gentleman to my dumbest interior core. I shall take off my hat for you my lady and I shall, for yay I am but an imbecile, forget to put back the hat on my head.",
                           sub2: "Good day to you Si- I SAID GOODDAY *slams door on own face*"}
                      })
                .end(function(err,res){
                    if(err)
                        done(err)
                    else{
                        //test for returned structure, specifically whether createdBy matches current username
                        done() 
                    }
                })
            
            
            
        })

        
    })

    it('tries to create a post without a token', function(done){
        
    })
    it('edits and updates object', function(done){
request(app)
            .put('/api/users/test@test.com')
            .send({name: 'Janardan'})
            .end(function(err, res){
                done()
            })
    })
    it('checks for the change', function(done){
        request(app)
            .get('/api/users/test@test.com')
            .end(function(err, res){
                expect(res.body).to.have.keys(['name', 'email','_id'])
                expect(res.body.name).to.equal('Janardan')
              done() 
            })
  })
    it('deletes object', function(done){
request(app)
            .delete('/api/users/test@test.com')
            .end(function(err, res){
                done()
            })
    })
    it('checks deletion', function(done){
        request(app)
            .get('/api/users/test@test.com')
            .expect(404)
            .end(function(err, res){
                if(err)
                    done(err)
                else
                    done() 
            })
  })
    it('deletes object', function(done){
request(app)
            .delete('/api/users/test@test1.com')
            .end(function(err, res){
                done()
            })
    })
    it('checks for deletion', function(done){
        request(app)
            .get('/api/users/test@test1.com')
            .expect(404)
            .end(function(err, res){
                if(err)
                    done(err)
                else
                    done() 
            })
  })
    describe('unauthenticated routes', function ()
             
    {
        
    })
})

//expect for gt should match email field with regexp
process.env.TEST_MODE = "off";

