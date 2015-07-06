var transform = require('../index.js').transform;
var should = require('chai').should();
describe('es3ify', function() {
    describe('unit tests', function () {
        it('should quote property keys', function() {
            transform('x = {dynamic: 0, static: 17};')
                    .should.equal('x = {dynamic: 0, "static": 17};');
        });

        it('should quote member properties', function() {
            transform('x.dynamic++; x.static++;')
                    .should.equal('x.dynamic++; x["static"]++;');
        });

        it('should remove trailing commas in arrays', function() {
            transform('[2, 3, 4,]')
                    .should.equal('[2, 3, 4]');
        });

        it('should keep comments near a trailing comma', function() {
            transform('[2, 3, 4 /* = 2^2 */,// = 6 - 2\n]')
                    .should.equal('[2, 3, 4 /* = 2^2 */// = 6 - 2\n]');
        });

        it('should remove trailing commas in objects', function() {
            transform('({x: 3, y: 4,})')
                    .should.equal('({x: 3, y: 4})');
        });

        it('should transform everything at once', function() {
            transform('({a:2,\tfor :[2,,3,],}\n.class)')
                    .should.equal('({a:2,\t"for" :[2,,3]}[\n"class"])');
        });
        it('should throw with an elisions ending an array', function () {
            transform.bind(null, '[1,2,,]').should.throw(SyntaxError);
        });
    });
    
});
