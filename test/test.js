function print(val) {
    console.log(val);
}



exports.tesg_func = function () {
    // var timeStamp = Date.now();
    // print(timeStamp)

    var aa = '0';
    if (aa) {
        print('true');
    } else {
        print('false');
    }
}


var jwt = require('jwt-simple');
var moment = require('moment');
var tokenKey = '123'
var checkToken = function (token) {
    try {
        var decoded = jwt.decode(token, tokenKey);
        if (decoded.exp <= Date.now()) {
            console.log('err 过期');
        } else {
            console.log('id:' + decoded.iss);
        }
    } catch (err) {
        console.log('err token');
    }
}
exports.test_jwt = function () {
    //  var expires = moment().add(7 ,'days').valueOf();
    var expires = moment().add(7, 'seconds').valueOf();
    var token = jwt.encode({
        iss: 'user_id',
        exp: expires,
    }, tokenKey);

    setTimeout(function () {
        checkToken('fewfefw');
    }, 8000); //8秒后执行
}



var QcloudSms = require("qcloudsms_js");
exports.test_msg = function () {
    // 短信应用 SDK AppID
    var appid = 1400254869; // SDK AppID 以1400开头
    // 短信应用 SDK AppKey
    var appkey = "619efe5ddef36da879e54fba5b6e9789";
    // 需要发送短信的手机号码
    var phoneNumbers = ["18201173629"];
    // 短信模板 ID，需要在短信控制台中申请
    var templateId = 7839; // NOTE: 这里的模板ID`7839`只是示例，真实的模板 ID 需要在短信控制台中申请
    // 签名
    var smsSign = "腾讯云"; // NOTE: 签名参数使用的是`签名内容`，而不是`签名ID`。这里的签名"腾讯云"只是示例，真实的签名需要在短信控制台申请
    // 实例化 QcloudSms
    var qcloudsms = QcloudSms(appid, appkey);
    // 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
    function callback(err, res, resData) {
        if (err) {
            console.log("err: ", err);
        } else {
            console.log("request data: ", res.req);
            console.log("response data: ", resData);
        }
    }

    var smsType = 0; // Enum{0: 普通短信, 1: 营销短信}
    var ssender = qcloudsms.SmsSingleSender();
    ssender.send(smsType, 86, phoneNumbers[0],
        "【腾讯云】您的验证码是: 5678", "", "", callback);
}



// http: //127.0.0.1:8000/
exports.test_express = function () {
    var express = require('express')
    var testApp = express()
    testApp.listen(8000);
    testApp.get('/', function (req, res) {
        res.send('hello world')
    })
}



exports.test_dir_look = function () {
    var dir = '/Users/oswin/Documents/company/ipa/art/csb_lua/src/';

    var fs = require("fs")
    var path = require("path")

    var root = path.join(__dirname)



    function readDirSync(path) {
        var pa = fs.readdirSync(path);
        pa.forEach(function (ele, index) {
            var info = fs.statSync(path + "/" + ele)
            if (info.isDirectory()) {
                console.log("dir: " + ele)
                readDirSync(path + "/" + ele);
            } else {
                console.log("file: " + path +"/" + ele)
            }
        });
    }

    console.log(__dirname)
    // readDirSync(dir);
}