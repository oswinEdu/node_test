/**不需要安装
 * 加密算法
 */
var crypto = require('crypto');

exports.md5 = function (content) {
    var md5 = crypto.createHash('md5');
    md5.update(content);
    return md5.digest('hex');
}

exports.toBase64 = function (content) {
    return new Buffer(content).toString('base64');
}

exports.fromBase64 = function (content) {
    return new Buffer(content, 'base64').toString();
}


exports.test_crypto = function() {
    console.log(this.md5('aaaaa'));
}