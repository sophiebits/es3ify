var transform = require('../index.js').transform;

function testCode(testName, codeIn, codeOut) {
    it("should " + testName, function() {
        expect(transform(codeIn)).toEqual(codeOut);
    });

    it(testName + " except in a multi-line comment", function() {
        var code = "/*\n" + codeIn + "\n*/";
        expect(transform(code)).toEqual(code);
    });

    it(testName + " except in a single-line comment", function() {
        var code = "//" + codeIn;
        expect(transform(code)).toEqual(code);
    });
}

describe('es3ify', function() {
    testCode('should quote property keys',
        'x = {dynamic: 0, static: 17, null: 34};',
        'x = {dynamic: 0, "static": 17, "null": 34};'
    );

    testCode('should quote member properties',
        'x.dynamic++; x.static++;',
        'x.dynamic++; x["static"]++;'
    );

    testCode('should remove trailing commas in arrays',
        '[2, 3, 4,]',
        '[2, 3, 4]'
    );

    testCode('should not remove commas in strings in arrays',
        '["2, 3, 4,"]',
        '["2, 3, 4,"]'
    );

    testCode('should keep comments near a trailing comma',
        '[2, 3, 4 /* = 2^2 */,// = 6 - 2\n]',
        '[2, 3, 4 /* = 2^2 */// = 6 - 2\n]'
    );

    testCode('should remove trailing commas in objects',
        '({x: 3, y: 4,})',
        '({x: 3, y: 4})'
    );

    testCode('should transform everything at once',
        '({a:2,\tfor :[2,,3,],}\n.class)',
        '({a:2,\t"for" :[2,,3]}[\n"class"])'
    );
});
