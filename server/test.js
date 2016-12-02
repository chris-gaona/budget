'use strict';

process.env.NODE_ENV = 'test';

var request = require('supertest');
var app = require('./app');

var mongoose = require('mongoose');
var User = mongoose.model('User');

describe('Requests to the /register route using POST', function () {
  describe('Register user & try to create a user with the same username again', function () {
    before(function (done) {
      User.collection.remove();
      done();
    });

    it('should register a new user to the budget-test db', function (done) {
      request(app)
        .post('/register')
        .send({username: 'jdog123', firstName: 'Jason', password: 'password', confirmPassword: 'password'})
        .expect(201, done);
    });

    it('should handle errors when registering with a username that already exists', function (done) {
      var user = {
        username: 'jdog123',
        firstName: 'Jason',
        password: 'password',
        confirmPassword: 'password'
      };

      request(app)
        .post('/register')
        .send(user)
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(/message/)
        .expect({
          "message": "Validation Failed",
          "errors": {"property": [{"code": 400, "message": 'The username you provided is already in use.'}]}
        })
        .end(function (err, res) {
          if (err) throw err;
          done();
        });
    });
  });

  describe('Register user to check various error message', function () {
    beforeEach(function (done) {
      User.collection.remove();
      done();
    });

    it('should handle errors when registering without any info', function (done) {
      request(app)
        .post('/register')
        .send()
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(/message/)
        .expect({
          "message": "Validation Failed",
          "errors": {"property": [{"code": 400, "message": "Please fill out all fields"}]}
        })
        .end(function (err, res) {
          if (err) throw err;
          done();
        });
    });

    it('should handle errors when registering without passwords matching', function (done) {
      var user = {
        username: 'jjohnson',
        firstName: 'Jason',
        password: 'password',
        confirmPassword: 'password123'
      };

      request(app)
        .post('/register')
        .send(user)
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(/message/)
        .expect({
          "message": "Validation Failed",
          "errors": {"property": [{"code": 400, "message": 'Uh oh! Passwords do not match'}]}
        })
        .end(function (err, res) {
          if (err) throw err;
          done();
        });
    });

    it('should handle errors when registering without a firstName', function (done) {
      var user = {
        username: 'jjohnson',
        password: 'password',
        confirmPassword: 'password'
      };

      request(app)
        .post('/register')
        .send(user)
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(/message/)
        .expect({
          "message": "Validation Failed",
          "errors": {"property": [{"code": 400, "message": 'First name is required'}]}
        })
        .end(function (err, res) {
          if (err) throw err;
          done();
        });
    });

    after(function (done) {
      User.collection.remove();
      done();
    });
  });
});

describe('Requests to the /login route using POST', function () {
  before(function (done) {
    User.collection.remove();

    request(app)
      .post('/register')
      .send({username: 'jdog123', firstName: 'Jason', password: 'password', confirmPassword: 'password'})
      .end(function (err, res) {
        if (err) throw err;
        done();
      });
  });

  it('should login a user to the budget-test db', function (done) {
    request(app)
      .post('/login')
      .send({username: 'jdog123', password: 'password'})
      .expect(200)
      .expect(/token/, done);
  });

  it('should handle errors when logging in without all the fields filled out', function (done) {
    request(app)
      .post('/login')
      .send()
      .expect(400)
      .expect('Content-Type', /json/)
      .expect(/message/)
      .expect({
        "message": "Validation Failed",
        "errors": {"property": [{"code": 400, "message": 'Please fill out all fields'}]}
      })
      .end(function (err, res) {
      if (err) throw err;
      done();
    });
  });

  it('should handle errors when logging in with a username that does not match', function (done) {
    request(app)
      .post('/login')
      .send({username: 'jdog123456', password: 'password'})
      .expect(400)
      .expect('Content-Type', /json/)
      .expect(/message/)
      .expect({
        "message": "Validation Failed",
        "errors": {"property": [{"code": 400, "message": 'Incorrect username or password'}]}
      })
      .end(function (err, res) {
        if (err) throw err;
        done();
      });
  });

  it('should handle errors when logging in with a password that does not match', function (done) {
    request(app)
      .post('/login')
      .send({username: 'jdog123', password: 'password123'})
      .expect(400)
      .expect('Content-Type', /json/)
      .expect(/message/)
      .expect({
        "message": "Validation Failed",
        "errors": {"property": [{"code": 400, "message": 'Incorrect username or password'}]}
      })
      .end(function (err, res) {
        if (err) throw err;
        done();
      });
  });

  after(function (done) {
    User.collection.remove();
    done();
  });
});

describe('Requests to the api/budgets route', function () {
  var header;
  var content;
  var budgetToUpdate;
  var username;

  before(function (done) {
    User.collection.remove();

    request(app)
      .post('/register')
      .send({username: 'jdog123', firstName: 'Jason', password: 'password', confirmPassword: 'password'})
      .end(function (err, res) {
        if (err) throw err;

        console.log(res.userBudgets);

        header = "Authorization";
        content = "Bearer " + res.body.token;

        done();
      });
  });

  describe('Using GET', function () {
    it('should return a 200 status code', function (done) {
      request(app)
        .get('/api/budgets')
        .set(header,content)
        .expect(200, done);
    });

    it('should return JSON format using GET', function (done) {
      request(app)
        .get('/api/budgets')
        .set(header,content)
        .expect('Content-Type', /json/, done);
    });

    it('should return an empty array', function (done) {
      request(app)
        .get('/api/budgets')
        .set(header,content)
        .expect(JSON.stringify([]), done);
    });
  });

  describe('Using POST', function () {
    it('should return a 201 status code & specified items', function (done) {
      request(app)
        .post('/api/budgets')
        .set(header,content)
        .send({ start_period: '10/29/2016', existing_cash: 22000, current_income: 1800 })
        .expect(201)
        .expect(/_id/i)
        .expect(/start_period/i)
        .expect(/existing_cash/i)
        .expect(/22000/)
        .expect(/current_income/i)
        .expect(/1800/)
        .end(function (err, res) {
          if (err) throw err;

          budgetToUpdate = res.body._id;

          done()
        });
    });
  });

  describe('Using PUT', function () {
    it('should return a 200 status code with object saying nModified', function (done) {
      request(app)
        .put('/api/budgets/' + budgetToUpdate)
        .set(header,content)
        .send({ start_period: '10/29/2016', existing_cash: 25000, current_income: 2000 })
        .expect(200)
        .expect({"ok":1,"nModified":1,"n":1}, done);
    });
  });

  describe('Using DELETE', function () {
    it('should return 204 status code with no content', function (done) {
      request(app)
        .delete('/api/budgets/' + budgetToUpdate)
        .set(header,content)
        .expect(200, done);
    });
  });

  describe('Requests to the users path using GET', function () {
    it('should return 401 if the user is not authenticated', function (done) {
      request(app)
        .get('/user/jdog123')
        .expect(401, done);
    });

    it('should return a 200 status code with the user data', function (done) {
      request(app)
        .get('/user/jdog123')
        .set(header,content)
        .expect(200, done);
    });

    it('should return a 404 status code with no user found', function (done) {
      request(app)
        .get('/user/jdog12345')
        .set(header,content)
        .expect(404)
        .expect({"message":"No user found","error":{ status: 404 }}, done);
    });
  });

  after(function (done) {
    User.collection.remove();
    done();
  });
});
