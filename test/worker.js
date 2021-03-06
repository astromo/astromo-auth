/* global describe it */

// Set some environment variables
process.env.HOSTNAME = 'local'
process.env.KEY = require('path').resolve(__dirname, './fixtures/keys/key')
process.env.KEY_PASSPHRASE = 'test123'

var app = require('../worker')
var async = require('async')
var request = require('supertest')
var naughty_strings = require('big-list-of-naughty-strings')

describe('Register route', function () {
  // Password too short
  it('Should return a 400 when data is not valid', function (done) {
    request(app)
      .post('/register')
      .send({
        email: 'test@astromo.io',
        password: 'short'
      })
      .expect(400, done)
  })

  it('Should return a JWT token when registering', function (done) {
    request(app)
      .post('/register')
      .send({
        email: 'test@astromo.io',
        password: 'test123'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function (res) {
        if (!res.body.token) throw new Error('No token returned')
      })
      .end(done)
  })
})

describe('Authenticate route', function () {
  it('Should return a 400 when no data is sent', function (done) {
    request(app)
      .post('/auth')
      .expect(400, done)
  })

  // Password too short
  it('Should return a 400 when data is not valid', function (done) {
    request(app)
      .post('/auth')
      .send({
        email: 'test@astromo.io',
        password: 'short'
      })
      .expect(400, done)
  })

  // Wrong password
  it('Should not authenticate when credentials are wrong', function (done) {
    request(app)
      .post('/auth')
      .send({
        email: 'michiel@demey.io',
        password: 'test1234'
      })
      .expect(401, done)
  })

  it('Should authenticate my user', function (done) {
    request(app)
      .post('/auth')
      .send({
        email: 'michiel@demey.io',
        password: 'test123'
      })
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('Should handle naughty strings', function (done) {
    this.timeout(0) // this might take a while

    async.each(naughty_strings, function (naughty, callback) {
      if (naughty.length < 7) return callback()

      request(app)
        .post('/register')
        .send({
          email: 'test@astromo.io',
          password: naughty
        })
        .expect(200, callback)
    }, done)
  })

})
