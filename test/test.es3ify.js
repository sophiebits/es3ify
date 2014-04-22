var es3ify = require('../index.js');
var transform = es3ify.transform;
var browserify = require('browserify');
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
    describe('isReserved', function () {
        var reserved = [
            "break", "case", "catch", "continue", "default", "delete", "do", "else",
            "finally", "for", "function", "if", "in", "instanceof", "new", "return",
            "switch", "this", "throw", "try", "typeof", "var", "void", "while", "with",
            "abstract", "boolean", "byte", "char", "class", "const", "debugger",
            "double", "enum", "export", "extends", "final", "float", "goto",
            "implements", "import", "int", "interface", "long", "native", "package",
            "private", "protected", "public", "short", "static", "super",
            "synchronized", "throws", "transient", "volatile",
        ];
        it('should corectly ID reserved words', function () {
            reserved.every(es3ify.isReserved).should.equal(true);
        });
        it('should not id words that are not reserved', function () {
            es3ify.isReserved('let').should.equal(false);
        });
    });
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
});
