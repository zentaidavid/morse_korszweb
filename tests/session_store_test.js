'use strict';

const expect = require('chai').expect;
const SessionStore = require('../session_store').create();
const User = require('../user');
const Errors = require('../errors');

describe('Session Store', () => {
    var user;
    beforeEach(function () {
        SessionStore.remove_all_sessions();
        user = new User(1, 'alice', 'Alice Green');
    });

    it('create a session with a given user', () => {
        const token = SessionStore.create_session(user);
        //expect(SessionStore.get_all_sessions().length).to.equal(1);
        expect(SessionStore.get_all_sessions()[token]).to.equal(user.id);
    });
    it('get user id from session token', () => {
        const token = SessionStore.create_session(user);
        expect(SessionStore.get_user_id(token)).to.equal(user.id);
    });
    it('trying to get a user with not existing session token', () => {
        const token = undefined;
        expect(() => {
            SessionStore.get_user_id(token)
        }).to.throw(Errors.TOKEN_DOES_NOT_EXIST);
    });
    it('validate user session token if it is correct', () => {
        const token = SessionStore.create_session(user);
        expect(SessionStore.validate_user_token(user, token)).to.equal(user.id);
    });
    it('trying to validate user token with not existing session token', () => {
        const token = undefined;
        expect(() => {
            SessionStore.validate_user_token(user, token)
        }).to.throw(Errors.TOKEN_DOES_NOT_EXIST);
    });
    it('trying to validate user token with invalid session token', () => {
        const token = SessionStore.create_session(user);
        const another_user_token = SessionStore.create_session(new User(2, 'user2', ''));
        expect(() => {
            SessionStore.validate_user_token(user, another_user_token)
        }).to.throw(Errors.TOKEN_MISMATCH);
    });
});