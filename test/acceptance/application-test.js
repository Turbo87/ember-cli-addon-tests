var path = require('path');
var expect = require('chai').expect;
var RSVP = require('rsvp');
var request = RSVP.denodeify(require('request'));
var AddonTestApp = require('../../lib').AddonTestApp;

describe('Acceptance | application', function() {
  this.timeout(300000);

  var previousCwd;
  var app;

  before(function() {
    previousCwd = process.cwd();
    process.chdir('test/fixtures/my-addon');

    app = new AddonTestApp();

    return app.create('dummy', {
      fixturesPath: 'test/fixtures/my-addon/tests'
    });
  });

  after(function() {
    process.chdir(previousCwd);
  });

  describe('startServer/stopServer', function() {
    before(function() {
      return app.startServer();
    });

    after(function() {
      return app.stopServer();
    });

    it('works', function() {
      return request('http://localhost:49741/assets/dummy.js')
        .then(function(response) {
          expect(response.body).to.contain('The dummy app is rendering correctly');
        });
    });
  });

  describe('run', function () {
    it('works', function() {
      return app.run('ember', '--version').then(function (result) {
        expect(result).to.have.property('code', 0);
        expect(result).to.have.property('signal', null);
        expect(result.errors).to.be.an('array');
        expect(result.errors).to.deep.equal([]);
        expect(result.output).to.be.an('array');
        expect(result.output.join('')).to.contain('version: 1.13');
      });
    });
  });
});
