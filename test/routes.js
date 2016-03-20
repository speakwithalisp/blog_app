process.env.TEST_MODE = "on";
var expect = require('expect.js');
var assert = require('assert');
var request = require('supertest');
var app = require('../src/routes/routes.js');

describe('express rest api server', function(){
    var id

    it('checks for empty collection', function(done){
request(app)
            .get('/api/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err,res){
                expect(res.body).to.be.empty()
                done()
            })
  })


    it('post object', function(done){
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
    it('post object', function(done){
request(app)
    .post('/api/users')
    .send({name: 'Johnny',
           email: 'test@test1.com',
           password:'supercalifragilistest'})
            .end(function(err, res){
                expect(res.body.user).to.only.have.keys(['name', 'email','_id'])
              done() 
    })
  })
    it('post object with matching email', function(done){
request(app)
    .post('/api/users')
    .send({name: 'Janardan',
           email: 'test@test.com',
           password:'supercalifragilistest'})
            .end(function(err, res){
                expect(err).to.be.an(Error)
                console.log(err)
              done() 
    })
  })
    it('gets object', function(done){
request(app)
            .get('/api/users/test@test.com')
            .end(function(err, res){
                expect(res.body).to.only.have.keys(['name', 'email','_id','posts', 'comments', 'createdAt'])
                expect(res.body.name).to.equal('John')
              done() 
    })
  })
    it('edits and updates object', function(done){
request(app)
            .put('/api/users/test@test.com')
            .send({name: 'Janardan',})
            .end(function(err, res){
                expect(res.ok).to.eql(1)
            })
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
                expect(res.ok).to.eql(1)
                      })
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
                expect(res.message).to.eql('Successfully deleted!')
            })
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
})

//expect for gt should match email field with regexp
process.env.TEST_MODE = "off";
