/**
 * express 服务器
 */
var express = require('express');
var app     = express();

var _user_ctrl = require('./ctrl/user_ctrl');

exports.start = function (cfg) {
    var usePort = cfg['SERVER_PORT'];
    app.listen(usePort);
    console.log("account server is listening on " + usePort);
}


function send(res, ret) {
    var str = JSON.stringify(ret);
    res.send(str)
}


//设置跨域访问, 每次请求先执行这里, 之后 next 向下匹配执行
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");

    next();
});



/**
 * url: http: //localhost:8200/register?account=112&&password=21
 *{
     "account": "112",
     "password": "21"
 }
 */

app.get('/register', function (req, res) {
    _user_ctrl.net_register(req, function(ret){
        send(res, ret);
    });
});



// ----------------------------  test ---------------------------- 


/*cdn: 没有缓存, 更改硬盘文件立刻生效*/
exports.test_static_express = function () {
    // assets 文件夹跟 node_modules 兄弟文件夹
    // http://127.0.0.1:8000/HelloWorld.png 
    // app.use(express.static('assets'));
    // app.use(express.static('files'));

    // http://127.0.0.1:8000/static/img/type1_bg.png
    // static 文件夹不存在只是在访问的时候需要加一下
    // app.use('/static', express.static('assets'));

    // http://127.0.0.1:8000/static/HelloWorld.png
    // 绝对路径__dirname 是当前 test.js 文件所在的文件夹 /Users/oswin/Documents/student/node_server/test
    app.use('/static', express.static(__dirname + '/../assets'));

    app.listen(8000);
    app.get('/', function (req, res) {
        res.send('hello world:' + __dirname);
    })
}

//失败：设置浏览器缓存
exports.test_catch_static_express = function () {
    // assets 文件夹跟 node_modules 兄弟文件夹
    // http://127.0.0.1:8000/HelloWorld.png 
    app.use(express.static('assets', {
        etag: false,
        maxAge: '9000', //9000 9秒  参考： https://www.npmjs.com/package/ms
        setHeaders: function (res, path, stat) {
            res.set('x-timestamp', Date.now())
        }
    }));

     app.listen(8000);
     app.get('/', function (req, res) {
         res.send('hello world:' + __dirname);
     })
}


