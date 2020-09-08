const rqiniu = require('qiniu');

rqiniu.conf.ACCESS_KEY = "JNLTF0CsNuXy_t93DmH2kstrQGo976vGMhv3JrYk";
rqiniu.conf.SECRET_KEY = "Jt_Yz52lHXbAeMyps3b6dXyx2jZEEPu7zQX22xTz";

// 要上传的空间
const bucket = "testfilesave";
// 文件前缀
const prefix = 'image/';

const config = new rqiniu.conf.Config();

// 生成上传文件的 token
const token = (bucket, key) => {
    const policy = new rqiniu.rs.PutPolicy({
        isPrefixalScope: 1,
        scope: bucket + ':' + key
    });
    return policy.uploadToken();
}

const upload_file = (file_name, file_path) => {
    // 保存到七牛的地址
    const file_save_path = prefix + file_name;
    // const file_save_path =  file_name

    // 七牛上传的token
    const up_token = token(bucket, file_save_path);

    const extra = new rqiniu.form_up.PutExtra();

    const formUploader = new rqiniu.form_up.FormUploader(config);

    // 上传文件
    formUploader.putFile(up_token, file_save_path, file_path, extra, (err, ret) => {
        if (!err) {
            // 上传成功， 处理返回值
            console.log(ret);
        } else {
            // 上传失败， 处理返回代码
            console.error(err);
        }
    });
}


upload_file('res/bk.png', '/Users/oswin/Documents/company/ipa/demo/popzoom/res/bk.png');