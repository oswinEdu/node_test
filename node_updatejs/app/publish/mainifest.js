/**
 * 1. lua加密成luac
 * 2. 读取src_et res文件夹里文件生成md5
 * 3. 生成 _out/version.mainifest、_out/proejct.mainifest
 * 4. 核查proejct.mainifest里文件和文件夹文件是否一样
 */


const rfs       = require("fs");
const rexec     = require('child_process').exec;
const rmutils   = require('../utils/mutils');
const rmcfg     = require('../utils/mcfg');
const mrupdate  = require('../utils/mrupdate');
const rcheck    = require('../publish/check');


let _md5Json = {};


function getVersion() {
    let vjson = {};
    vjson['packageUrl'] = '';
    vjson['remoteVersionUrl'] = '';
    vjson['remoteManifestUrl'] = '';
    vjson['packageUrlBackup'] = '';
    vjson['remoteVersionUrlBackup'] = '';
    vjson['remoteManifestUrlBackup'] = '';
    vjson['domainNameList'] = ['1', '2'];
    vjson['version'] = mrupdate.update_version();
    return vjson;
}


//读文件数据
function readFile(filePath) {
    let md5Val = rmutils.file_md5(filePath);
    let md5Key = filePath.replace(rmcfg.READ_PATH, '');

    if (md5Key !== filePath && !_md5Json[md5Key]) {
        _md5Json[md5Key] = md5Val;
    } else {
        rmutils.error('md5Key出错' + filePath);
    }
}



//读取文件数据生成md5
function generalMd5() {
    if (!rfs.existsSync(rmcfg.RES_PATH) || !rfs.existsSync(rmcfg.SRCET_PATH)) {
        rmutils.error('文件夹不存在：res || src_et');
        return;
    }

    rmutils.ergodic_dir_files(rmcfg.RES_PATH, function (filePath){
        readFile(filePath);
    });
    rmutils.ergodic_dir_files(rmcfg.SRCET_PATH, function (filePath) {
        readFile(filePath);
    });
}



//lua变成 luac
function cryptoLua(finishBack) {    
    if (!rfs.existsSync(rmcfg.SRC_PATH)) {
        rmutils.error('文件夹不存在：' + rmcfg.SRC_PATH);
        return;
    }
    if (rfs.existsSync(rmcfg.SRCET_PATH)) {
        rmutils.delete_dir(rmcfg.SRCET_PATH);
    }

    let cocos = 'cocos luacompile -s ' + rmcfg.SRC_PATH + ' -d ' + rmcfg.SRCET_PATH;
    let cmd = cocos + ' -e -k mXjv7U5dUl1aMTVV_xianlai -b SQLLiteData --disable-compile';
    rexec(cmd, (err, stdout, stderr) => {
        if (err) {
            rmutils.error('执行cocos命令报错: ' + err)
            return;
        }
        finishBack();
    });
}


// project.mainifest生成MD5的文件和文件夹里的文件是否一样
function checkManifest() {
    let upFiles = rmutils.get_upload_files();
    rcheck.check_manifest(upFiles, rmcfg.PROJECT_FILE, rmcfg.READ_PATH);
}



function outManifest(md5Json) {
    try {
        if (rfs.existsSync(rmcfg.PROJECT_FILE)) {
            rmutils.delete_file(rmcfg.PROJECT_FILE)
        }
        if (rfs.existsSync(rmcfg.VERSION_FILE)) {
            rmutils.delete_file(rmcfg.VERSION_FILE)
        }
    } catch (error) {
        rmutils.error(error)
    }

    //保存两个 mainifest 文件
    let pjson = getVersion();
    let vjson = getVersion();
    pjson['assets'] = md5Json;
    rmutils.save_json_file_sync(rmcfg.PROJECT_FILE, pjson);
    rmutils.save_json_file_sync(rmcfg.VERSION_FILE, vjson);

    rmutils.print('mainifest 生成文件完成');
}



let general_mainifest = function (finishBack) {
    _md5Json = {};

    cryptoLua(function() {
        generalMd5();
        outManifest(_md5Json);
        checkManifest();

        finishBack();
    });
}

exports.general_mainifest = general_mainifest;
// general_mainifest()

