'use strict';

const expect = require('chai').expect;
const Morse = require('../morse');

describe('Morse', () => {
    describe('decode messages', () => {
        it('decode a morse charachter', () => {
            const result = Morse.decode('...');
            expect(result).to.equal('S');
        });
        it('decode a morse word', () => {
            const result = Morse.decode('.... . -.--');
            expect(result).to.equal('HEY');
        });
        it('decode a morse message', () => {
            const result = Morse.decode('.... . -.--   .--- ..- -.. .');
            expect(result).to.equal('HEY JUDE');
        });
        it('decode a morse message if there are starting whitespaces', () => {
            const result = Morse.decode('     .... . -.--   .--- ..- -.. .');
            expect(result).to.equal('HEY JUDE');
        });
        it('decode a morse message if there are ending whitespaces', () => {
            const result = Morse.decode('     .... . -.--   .--- ..- -.. .       ');
            expect(result).to.equal('HEY JUDE');
        });
        it('decode a service code', () => {
            const result = Morse.decode('...---...');
            expect(result).to.equal('SOS');
        });
        it('decode a message while a service code in it', () => {
            const result = Morse.decode('.... . -.--   ...---...   .--- ..- -.. .');
            expect(result).to.equal('HEY SOS JUDE');
        });
    });
});