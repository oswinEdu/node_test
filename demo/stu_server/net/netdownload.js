var fs = require("fs");
var path = require("path");
var request = require("request");

const {
    DownloaderHelper
} = require('node-downloader-helper');


const urlList = [
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/fall-of-the-lich-king/fall-of-the-lich-king-1920x1080.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/black-temple/black-temple-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/zandalari/zandalari-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/rage-of-the-firelands/rage-of-the-firelands-1920x1200.jpg",
    "http://content.battlenet.com.cn/wow/media/wallpapers/patch/fury-of-hellfire/fury-of-hellfire-3840x2160.jpg",
];
const testUrl = "http://content.battlenet.com.cn/wow/media/wallpapers/patch/zandalari/zandalari-1920x1200.jpg";
const testNoUrl = "http://content.battlenet.com.cn/wow/media/wallpapers/patch/zandalari/zandalari-1920x.jpg";
const testBigUrl = 'http://www.ovh.net/files/1Gio.dat';


exports.test_downfile = function () {
    // // these are the default options
    const options = {
        method: 'GET', // Request Method Verb
        // Custom HTTP Header ex: Authorization, User-Agent
        headers: {
            // 'user-agent': pkg.name + '@' + pkg.version
        },
        retry: {
            maxRetries: 3,
            delay: 3000
        }, // { maxRetries: number, delay: number in ms } or false to disable (default)
        fileName: '', // Custom filename when saved
        override: false, // if true it will override the file, otherwise will append '(number)' to the end of file
        forceResume: false, // If the server does not return the "accept-ranges" header, can be force if it does support it
        httpRequestOptions: {}, // Override the http request options  
        httpsRequestOptions: {} // Override the https request options, ex: to add SSL Certs
    };

    const dl = new DownloaderHelper(testNoUrl, __dirname);
    dl.on('end', () => console.log('Download Completed'))

    dl.on('error', err => console.log('Download error:'))

    dl.start();
}


exports.test_downrequest = function () {
    //创建文件夹目录
    var dirPath = path.join(__dirname, "file/aa/ewf/fwfw/afd");
    console.log(dirPath);
    try {
        fs.mkdir(dirPath, {
            recursive: true
        });
    } catch (error) {
        
    }
    

    // if (!fs.existsSync(dirPath)) {
    //     // fs.mkdirSync(dirPath, {
    //     fs.mkdir(dirPath, {
    //         recursive: true
    //     });
    //     console.log("文件夹创建成功");
    // } else {
    //     console.log("文件夹已存在");
    // }


    let fileName = "outaaa.png";
    let url = testUrl;
    // let stream = fs.createWriteStream(path.join(dirPath, fileName));
    // request(url).pipe(stream).on("close", function (err) {
    //     console.log("文件[" + fileName + "]下载完毕");
    // });

}