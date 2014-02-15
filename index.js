var Syntax = require('esprima-fb').Syntax;
var jstransform = require('jstransform');
var through = require('through');
var utils = require('jstransform/src/utils');

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
var reservedDict = {};
reserved.forEach(function(k) {
    reservedDict[k] = true;
});

function visitMemberExpression(traverse, node, path, state) {
    utils.catchup(node.object.range[1], state);
    utils.append('[', state);
    utils.catchupWhiteSpace(node.property.range[0], state);
    utils.append('"', state);
    utils.catchup(node.property.range[1], state);
    utils.append('"]', state);
}
visitMemberExpression.test = function(node, path, state) {
    return node.type === Syntax.MemberExpression &&
        node.property.type === Syntax.Identifier &&
        reservedDict[node.property.name] === true;
};

function visitProperty(traverse, node, path, state) {
    utils.catchup(node.key.range[0], state);
    utils.append('"', state);
    utils.catchup(node.key.range[1], state);
    utils.append('"', state);
}
visitProperty.test = function(node, path, state) {
    return node.type === Syntax.Property &&
        node.key.type === Syntax.Identifier &&
        reservedDict[node.key.name] === true;
};

var visitorList = [visitMemberExpression, visitProperty];

module.exports = function(file) {
    var data = '';
    function write(chunk) {
        data += chunk;
    }

    function compile() {
        var transformed = jstransform.transform(visitorList, data);
        this.queue(transformed.code);
        this.queue(null);
    }

    return through(write, compile);
};
