var es3ify = require('../index.js');
var browserify = require('browserify');
var should = require('chai').should();
describe('integration tests', function () {
    it('should work to transform files', function (done) {
        browserify({
            basedir: './test'
        })
        .add('./file1')
        .transform(es3ify)
        .bundle(function (err, resp) {
            if (err) {
                return done(err);
            }
            resp.should.match(
                /"for" :\[2,,3\]/,
                'remove trailing commas'
            );
            resp.should.match(
                /exports\["static"\] = require\('\.\/file2'\);/,
                'swtich dot to bracket notation'
            );
            resp.should.match(
                /thing\["class"\] = \[2, 3, 4 \/\* = 2\^2 \*\/\/\/ = 6 - 2/,
                'fix a bunch of stuff'
            );
            done();
        });
    });
});