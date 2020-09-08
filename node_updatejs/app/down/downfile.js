// const qiniu = require("qiniu");

// var accessKey = 'JNLTF0CsNuXy_t93DmH2kstrQGo976vGMhv3JrYk';
// var secretKey = 'Jt_Yz52lHXbAeMyps3b6dXyx2jZEEPu7zQX22xTz';

// var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
// var config = new qiniu.conf.Config();
// //config.useHttpsDomain = true;
// // config.zone = qiniu.zone.Zone_z0;

// var bucketManager = new qiniu.rs.BucketManager(mac, config);

// // http: //pwu0wpl5t.bkt.clouddn.com/xcode1.png
// var publicBucketDomain = 'http://pwu0wpl5t.bkt.clouddn.com';
// var key = 'xcode1.png';
// // 公开空间访问链接
// var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
// console.log(publicDownloadUrl);

const http = require("http");
const fs = require("fs");
const path = require("path");

const urlList = [
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/fall-of-the-lich-king/fall-of-the-lich-king-1920x1080.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/black-temple/black-temple-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/zandalari/zandalari-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/rage-of-the-firelands/rage-of-the-firelands-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/fury-of-hellfire/fury-of-hellfire-3840x2160.jpg",
];

function getHttpReqCallback(imgSrc, dirName, index) {
    var fileName = index + "-" + path.basename(imgSrc);
    var callback = function (res) {
        console.log("request: " + imgSrc + " return status: " + res.statusCode);
        var contentLength = parseInt(res.headers['content-length']);
        var fileBuff = [];
        res.on('data', function (chunk) {
            var buffer = new Buffer(chunk);
            fileBuff.push(buffer);
        });
        res.on('end', function () {
            console.log("end downloading " + imgSrc);
            if (isNaN(contentLength)) {
                console.log(imgSrc + " content length error");
                return;
            }
            var totalBuff = Buffer.concat(fileBuff);
            console.log("totalBuff.length = " + totalBuff.length + " " + "contentLength = " + contentLength);
            if (totalBuff.length < contentLength) {
                console.log(imgSrc + " download error, try again");
                startDownloadTask(imgSrc, dirName, index);
                return;
            }
            fs.appendFile(dirName + "/" + fileName, totalBuff, function (err) {});
        });
    };

    return callback;
}

var startDownloadTask = function (imgSrc, dirName, index) {
    console.log("start downloading " + imgSrc);
    var req = http.request(imgSrc, getHttpReqCallback(imgSrc, dirName, index));
    req.on('error', function (e) {
        console.log("request " + imgSrc + " error, try again");
        startDownloadTask(imgSrc, dirName, index);
    });
    req.end();
}

urlList.forEach(function (item, index, array) {
    startDownloadTask(item, './', index);
})