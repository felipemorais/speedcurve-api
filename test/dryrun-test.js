/**
 * Copyright (c) 2013, Twitter Inc. and other contributors
 * Released under the MIT License
 */

var assert      = require('assert'),
    SpeedCurve = require('../lib/speedcurve'),
    spd = new SpeedCurve('np7p81l06vrufpnu0y5lzz13gkgkc5', true);

describe('Dry Run', function() {
  describe('SpeedCurve API core', function() {
    it('gets SpeedCurve version', function(done) {    
      assert.equal(spd.version, '0.0.1');
      done();
    });
  });

  describe('Sites', function() {
    it('Get all sites for a User', function(done) {
      spd.sites({
          days: 1,
          format: 'json'
        },
        function (err, data) {
          if (err){
            return done(err);
          }
          assert.equal(data.path, '/v1/sites?days=1&format=json');
          assert.equal(data.method, 'GET');
          done();
        });
    });
  });

  describe('URLs', function() {
    it('Get trends and all tests for a URL', function(done) {
      spd.urls(
        {
          id: 123,
          browser: 'chrome',
          days: 1
        },
        function (err, data) {
          if (err){
            return done(err);
          }
          assert.equal(data.path, '/v1/urls/123?browser=chrome&days=1');
          assert.equal(data.method, 'GET');
          done();
        }
      );
    });
  });

  describe('Tests', function() {
    it('Get a test', function(done) {    
      spd.tests(
        {
          id: 123
        },
        function (err, data) {
          if (err){
            return done(err);
          }
          assert.equal(data.path, '/v1/tests/123');
          assert.equal(data.method, 'GET');
          done();
        }
      );
    });
  });

  describe('Notes', function() {
    it('Get all notes', function(done) {    
      spd.notes(
        function (err, data) {
          if (err){
            return done(err);
          }
          assert.equal(data.path, '/v1/notes');
          assert.equal(data.method, 'GET');
          done();
        }
      );
    });

    it('Add a note', function(done) {    
      spd.notes(
        {
          note: 'abc',
          detail: 'qwerty'
        },
        function (err, data) {
          if (err){
            return done(err);
          }
          assert.equal(data.path, '/v1/notes?note=abc&detail=qwerty');
          assert.equal(data.method, 'POST');
          done();
        }
      );
    });
  });

  describe('Deployments', function() {
    it('Lastest deployment', function(done) {    
      spd.deploy(
        function (err, data) {
          if (err){
            return done(err);
          }
          assert.equal(data.path, '/v1/deploy/latest');
          assert.equal(data.method, 'GET');
          done();
        }
      );
    });

    it('Add a deployment', function(done) {    
      spd.deploy(
        {
          note: 1,
          detail: 'json'
        },
        function (err, data) {
          if (err){
            return done(err);
          }
          assert.equal(data.path, '/v1/deploy?note=1&detail=json');
          assert.equal(data.method, 'POST');
          done();
        }
      );
    });

    it('Get a deployment', function(done) {    
      spd.deploy(
        {
          id: 1234,
          note: 1,
          detail: 'json'
        },
        function (err, data) {
          if (err){
            return done(err);
          }
          assert.equal(data.path, '/v1/deploy/1234?note=1&detail=json');
          assert.equal(data.method, 'GET');
          done();
        }
      );
    });
  });
});
