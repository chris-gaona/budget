var request = require('supertest');
var app = require('./app');

describe('Requests to the api/budgets route using GET', function () {
  it('should return a 200 status code', function (done) {
    request(app)
      .get('/api/budgets')
      .expect(200, done);
  });

  it('should return JSON format using GET', function (done) {
    request(app)
      .get('/api/budgets')
      .expect('Content-Type', /json/, done);
  });

  it('should return budgets using GET', function (done) {
    request(app)
      .get('/api/budgets')
      .expect(/start_period/)
      .expect(/current_income/)
      .expect(/existing_cash/)
      .expect(/budget_items/)
      .expect(/editing/, done);
  });
});

describe('Requests to the api/budgets route using POST', function () {
  it('should return a 201 status code', function (done) {
    request(app)
      .post('/api/budgets')
      .send({ id: 3, start_period: '10/29/2016', existing_cash: 22000, current_income: 1800 })
      .expect(201, done);
  });

  it('should return new budget', function (done) {
    request(app)
      .post('/api/budgets')
      .send({ id: 3, start_period: '10/29/2016', existing_cash: 22000, current_income: 1800 })
      .expect(/id/i)
      .expect(/start_period/i)
      .expect(/existing_cash/i)
      .expect(/current_income/i, done);
  });
});

describe('Requests to the api/budgets/:id route using PUT', function () {
  it('should return a 200 status code', function (done) {
    request(app)
      .put('/api/budgets/2')
      .send({ id: 2, start_period: '10/29/2016', existing_cash: 22000, current_income: 1800 })
      .expect(200, done);
  });

  it('should return updated budget', function (done) {
    request(app)
      .post('/api/budgets')
      .send({ id: 2, start_period: '10/29/2016', existing_cash: 22000, current_income: 1800 })
      .expect(/id/i)
      .expect(/start_period/i)
      .expect(/existing_cash/i)
      .expect(/current_income/i, done);
  });
});

describe('Requests to the api/budgets/:id route using DELETE', function () {
  it('should return 204 status code', function (done) {
    request(app)
      .delete('/api/budgets/2')
      .send({ id: 2, start_period: '10/29/2016', existing_cash: 22000, current_income: 1800 })
      .expect(204, done);
  });
});

describe('Requests to the users path using GET', function () {
  it('should return a 200 status code', function (done) {
    request(app)
      .get('/users')
      .expect(200, done);
  });
});
