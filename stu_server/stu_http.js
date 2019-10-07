/**
 * 客户端
 */
var http = require('http');
var https = require('https');
var qs = require('querystring');



//get
//http.get2("https://api.weixin.qq.com/sns/oauth2/access_token",json_data,callback,true);
//http.get2("https://api.weixin.qq.com/sns/userinfo",jsondata,callback,true);
exports.get2 = function (url, data, callback, safe) {
    var content = qs.stringify(data);
    var url = url + '?' + content;
    var proto = http;
    if (safe) {
        proto = https;
    }
    var req = proto.get(url, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            var json = JSON.parse(chunk);
            callback(true, json);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        callback(false, e);
    });

    req.end();
};



//request
//http.get(ip,httpPort,"/get_server_info",reqdata,function(ret,data){});
exports.get = function (host, port, path, data, callback, safe) {
    var content = qs.stringify(data);
    var options = {
        hostname: host,
        path: path + '?' + content,
        method: 'GET'
    };
    if (port) {
        options.port = port;
    }
    var proto = http;
    if (safe) {
        proto = https;
    }
    var req = proto.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);  
        console.log('HEADERS: ' + JSON.stringify(res.headers));  
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            var json = JSON.parse(chunk);
            callback(true, json);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        callback(false, e);
    });

    req.end();
};