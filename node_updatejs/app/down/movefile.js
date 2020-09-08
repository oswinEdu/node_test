const qiniu = require("qiniu");

var accessKey = 'JNLTF0CsNuXy_t93DmH2kstrQGo976vGMhv3JrYk';
var secretKey = 'Jt_Yz52lHXbAeMyps3b6dXyx2jZEEPu7zQX22xTz';

var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var config = new qiniu.conf.Config();
//config.useHttpsDomain = true;
config.zone = qiniu.zone.Zone_z0;

var bucketManager = new qiniu.rs.BucketManager(mac, config);

var srcBucket = "qiniu_free_stu";
var srcKey = "image/bk.png";
var destBucket = "testfilesave";
var destKey = "mage/bk.png";
// 强制覆盖已有同名文件
var options = {
    force: true
}
bucketManager.move(srcBucket, srcKey, destBucket, destKey, options, function (
    err, respBody, respInfo) {
    if (err) {
        console.log(err);
        //throw err;
    } else {
        //200 is success
        console.log(respInfo.statusCode);
    }
});