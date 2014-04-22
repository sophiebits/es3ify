var isReserved = require('../index.js').isReserved;
var should = require('chai').should();
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
        reserved.every(isReserved).should.equal(true);
    });
    it('should not id words that are not reserved', function () {
        isReserved('let').should.equal(false);
    });
});