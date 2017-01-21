'use strict';

const request = require('supertest');
const app = require('../index');
const expect = require('chai').expect;
const chai = require('chai');
chai.should();

describe('Message board', function () {
    var token;
    const username = 'bob';
    const message = '...---...';
    const message_raw = 'SOS';

    function has_token(res) {
        res.body.should.have.property('token');
    }

    function save_token(res) {
        token = res.body.token;
    }

    function has_message(res) {
        const messages = JSON.parse(res.text);
        expect(messages.length).to.equal(1);
        expect(messages[0].message).to.equal(message_raw);
        expect(messages[0].from).to.equal(username);
        expect(messages[0].to).to.equal(username);
    }

    describe('POST /users', function () {
        it('get a session token if successfully registered a new user', function (done) {
            request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({'username': username})
                .expect('Content-Type', /json/)
                .expect(has_token)
                .expect(save_token)
                .expect(200, done)
        });
        it('error 400: trying to register a user with an already existing username', function (done) {
            request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({'username': username})
                .expect('Content-Type', /json/)
                .expect(400, done)
        });
        it('error 400: trying to register a user without username', function (done) {
            request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({'username': ''})
                .expect('Content-Type', /json/)
                .expect(400, done)
        });

    });
    describe('POST /users/:username/messages', function () {
        it('202: successfully sent a message', function (done) {
            request(app)
                .post('/users/' + username + '/messages')
                .set('X-Auth', token)
                .set('Content-Type', 'application/json')
                .send({'message': message})
                .expect(202)
                .end(done)
        });
        it('error 404: recipient not exist', function (done) {
            request(app)
                .post('/users/' + 'not_exist' + '/messages')
                .set('X-Auth', token)
                .set('Content-Type', 'application/json')
                .send({'message': message})
                .expect(404)
                .end(done)
        });
        it('error 401: success authentication', function (done) {
            request(app)
                .post('/users/' + 'not_exist' + '/messages')
                .set('Content-Type', 'application/json')
                .send({'message': message})
                .expect(401)
                .end(done)
        })
    });
    describe('GET /users/:username/messages', function () {
        const user2 = 'jude';

        before(function (done) {
            request(app)
                .post('/users')
                .set('Content-Type', 'application/json')
                .send({'username': user2})
                .end(done)
        });


        it('200: the messages sent and the authentication successful', function (done) {
            request(app)
                .get('/users/' + username + '/messages')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('X-Auth', token)
                .expect(200)
                .expect(has_message)
                .end(done)
        });
        it('error 403: trying to get messages from another user', function (done) {
            request(app)
                .get('/users/' + user2 + '/messages')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('X-Auth', token)
                .expect(403)
                .end(done)
        });
        it('error 401: the authentication not successful', function (done) {
            request(app)
                .get('/users/' + username + '/messages')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('X-Auth', 'wrong_token')
                .expect(401)
                .end(done)
        });
    });
});