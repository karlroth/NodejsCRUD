var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

var server = require('./../app');

describe('Post /employees/create', function() {
    it('should insert employee into the EMP_DTL Table', function(done) {
        chai.request(server) 
        .post('/employees/create')
        .type('form')
        .send({name:'Dummy',email:'dummy@yash.com'})
        .end(function(err,res) {
           res.status.should.equal(200);
           res.text.should.contain('created employee');
           done();
        });
    });
});

describe('Get /employees/list', function() {
   it('should return employees form EMP_DTL Table', function(done) {
     chai.request(server)
     .get('/employees/list')
     .end(function(err, res) {
       res.status.should.equal(200);
       res.text.should.contain('Dummy');
       done();
     });
   });
 });

 describe('Get /employees/find/dummy@yash.com', function() {
     it('should return the employee from EMP_DTL Table with email=dummy@yash.com', function(done) {
         chai.request(server) 
         .get('/employees/find/dummy@yash.com')
         .end(function(err, res) {
             res.status.should.equal(200);
             res.text.should.contain('Dummy');
             done();
         });
     });
 });

 describe('Put /employees/update', function() {
     it('should update the employee with email=dummy@yash.com', function(done) {
         chai.request(server) 
         .put('/employees/update')
         .type('form')
         .send({name:'Test', email:'dummy@yash.com'})
         .end(function(err, res) {
             res.status.should.equal(200)
             res.text.should.contain('updated employee')
             done();
         })
     })
 })

 describe('Delete /employees/delete', function() {
     it('should delete employee from EMP_DTL Table', function(done) {
         chai.request(server)
         .del('/employees/delete')
         .type('form')
         .send({email:'dummy@yash.com'})
         .end(function(err,res) {
             res.status.should.equal(200);
             res.text.should.contain('deleted employee');
             done();
         });
     });
 });

 