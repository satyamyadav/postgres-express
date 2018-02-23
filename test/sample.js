'use strict';

const chai =  require('chai');
chai.should();

var foo = 'bar';
var beverages = { tea: ['chai', 'matcha', 'oolong'] };

describe('sample Test', () => {
  it('It should fail', (done) => {
    foo.should.be.a('string');
    foo.should.equal('bar');
    foo.should.have.lengthOf(4);
    beverages.should.have.property('tea').with.lengthOf(3);
    done();
  });
});
