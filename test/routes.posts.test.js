'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../server');


describe('GET /api/posts', () => {
  it('should return all posts', done => {
    chai
      .request(server)
      .get('/api/posts')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {'status': 'success'}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {'data': [3 post objects]}
        res.body.data.length.should.eql(3);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id',
          'title',
          'body',
          'slug',
          'author_id',
          'created_at',
          'updated_at'
        );
        done();
      });
  });
});
