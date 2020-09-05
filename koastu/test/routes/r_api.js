/*
* 1.微信js-sdk
*/

const utils         = require('../utils/m_utils')
const superagent    = require('superagent')
const sha1          = require('sha1')
const router        = require('koa-router')()

router.prefix('/apitest')

var _accessToken = null;
var _jsapiTicket = null;


/*
! 微信公共账号后台, 一定要填写 JS接口安全域名 否则校验通不过
https://blog.csdn.net/solocao/article/details/82720619
https://www.fengerzh.com/jssdk-invalid-signature/
tool.nat300.top
*/
router.get('/wxapiconfig', async (ctx, next) => {
    //1.获取accessToken，用于获取访问wx的api的凭证；
    // const accessToken = await getAccessToken()
    var accessToken = null
    if (_accessToken) {
        accessToken = _accessToken;
    } else {
        accessToken = await getAccessToken();
        _accessToken = accessToken;
    }
    utils.log(accessToken)
    

    //2.获取jsapiTicket 用于访问wx的api的凭证
    // const jsapiTicket = await getJsapiTicket(accessToken)
    var jsapiTicket = null
    if (_jsapiTicket) {
        jsapiTicket = _jsapiTicket;
    } else {
        jsapiTicket = await getJsapiTicket(accessToken);
        _jsapiTicket = jsapiTicket;
    }

    //3.生成时间戳和随机字符串
    const nonceStr = randomString(16) //随机字符串
    const timestamp = (Date.now() / 1000).toFixed(); //时间戳
    // const url = 'http://245691q6b5.zicp.vip/wx'
    // const url = 'http://172.16.120.120:7456/'
    // const url = 'http://tool.nat300.top/'
    // const url = encodeURIComponent('http://tool.nat300.top/')
    const url = decodeURIComponent('http://tool.nat300.top/')
    //4.按照微信官方要求拼接字符串
    const str = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
    //5.sha1加密后获得signature参数
    const signature = sha1(str);
    //6.通过官方工具验证signature的正确性：//https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign

    utils.log("jsapiTicket: " + jsapiTicket);
    utils.log("nonceStr: " + nonceStr);
    utils.log("timestamp: " + timestamp);
    utils.log("url: " + url);
    utils.log("str: " + str);
    utils.log("signature: " + signature);

    //7.将参数返给前端
    ctx.body = JSON.stringify({
        jsapiTicket,
        nonceStr,
        timestamp,
        signature,
        jsApiList: [
            'updateAppMessageShareData',
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'getLocation',
            'getNetworkType',
            'onMenuShareWeibo',
        ] //需要请求的接口，也可以在前端使用时增加此参数
    });
});


function getAccessToken() {
    var appid = "wxe345523745158588";
    var appsecret = "b5563bf78dca85d6c6fe3428fa1e06f9";
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`
    return superagent.get(url).then(res => {
        return JSON.parse(res.text).access_token
    })
}


function getJsapiTicket(accessToken) {
    const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`
    return superagent.get(url).then(res => {
        return JSON.parse(res.text).ticket
    });
}


function randomString(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}




module.exports = router