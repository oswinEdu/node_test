const rfs       = require('fs');
const rprocess  = require('process');
const rpath     = require("path");
const rcrypto   = require('crypto');
const rmcfg     = require('./mcfg')


function print(msg) {
    console.log(msg)
}
exports.print = print

function printE(msg) {
    console.error(msg)
    // throw "抛异常";
}
exports.printE = printE

function error(err) {
    if (err) {
        printE(err)
    }
    rprocess.exit(0);
}
exports.error = error

function print_arr(arrs) {
    for(let i=0; i<arrs.length; i++) {
        print(arrs[i]);
    }
}
exports.print_arr = print_arr



//删除文件夹下所有文件
function delete_dir(path) {
    var files = [];
    if (rfs.existsSync(path)) {
        files = rfs.readdirSync(path);
        
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (rfs.statSync(curPath).isDirectory()) {
                delete_dir(curPath);
            } else {
                rfs.unlinkSync(curPath);
            }
        });
        rfs.rmdirSync(path);
    }
}
exports.delete_dir = delete_dir;

//删除具体某个文件
function delete_file(filePath) {
    if(rfs.existsSync(filePath)) {
        rfs.unlinkSync(filePath);
    }
}
exports.delete_file = delete_file;



// xxx/data/src/main.lua
// main.lua
function get_filename(path) {
    let trimPath = path.trim();
    let pos = trimPath.lastIndexOf('/') + 1;
    if (pos >= trimPath.length) {
        printE('get_filename: error ' + path);
    }
    let fileName = trimPath.slice(pos);
    return fileName
}
exports.get_filename = get_filename;

// xxx/data/src/main.lua
// xxx/data/src/
function get_filedir(path) {
    let trimPath = path.trim();
    let pos = trimPath.lastIndexOf('/') + 1;
    if (pos >= trimPath.length) {
        printE('get_filename: error ' + path);
    }
    let fileName = trimPath.slice(0, pos);
    return fileName
}
exports.get_filedir = get_filedir;



//xxx/data/src/  src文件夹下所有文件
function get_all_files(startPath) {
    let result = [];

    function finder(path) {
        let files = rfs.readdirSync(path);
        files.forEach((val, index) => {
            if (!rmcfg.IGNORE_FILES[val]) {
                let fPath = rpath.join(path, val);
                let stats = rfs.statSync(fPath);
                if (stats.isDirectory()) finder(fPath);
                if (stats.isFile()) result.push(fPath);
            }
        });
    }
    finder(startPath);

    return result;
}
exports.get_all_files = get_all_files;



//遍历文件夹里所有文件
function ergodic_dir_files(path, fileBack) {
    let pa = rfs.readdirSync(path);
    pa.forEach(function (fileName, index) {
        let filePath = rpath.join(path, fileName);

        if (rfs.statSync(filePath).isDirectory()) {
            ergodic_dir_files(filePath, fileBack);
        } else {
            //过滤掉无用文件如 .DS_Store
            if (!rmcfg.IGNORE_FILES[fileName]) {
                fileBack(filePath);
            }
        }
    });
}
exports.ergodic_dir_files = ergodic_dir_files;


//src_et res 放到一个文数组
function get_upload_files() {
    let srcetPath = get_all_files(rmcfg.SRCET_PATH);
    let resPath = get_all_files(rmcfg.RES_PATH);
    let arrs = srcetPath.concat(resPath);
    return arrs;
}
exports.get_upload_files = get_upload_files;



// cutPath:xxx/data/         path: xxx/data/src/main.lua
// src/main.lua
function cut_path_file(cutPath, path) {
    let result = '';
    try {
        result = path.replace(cutPath, '');
    } catch (error) {
        error('剪切路径出错: ' + cutPath)
    }

    return result;
}
exports.cut_path_file = cut_path_file;



//同步读取json文件
function read_json_file_sync(filePath) {
    var data = rfs.readFileSync(filePath, 'utf-8');
    if (!data) {
        error('读取json文件error: ' + filePath);
    }
    var jdata = data.toString();
    jdata = JSON.parse(jdata);

    return jdata;
}
exports.read_json_file_sync = read_json_file_sync;

//json数据assets字段对应内容
function get_mainifest_assets(filePath) {
    let mainifest = read_json_file_sync(filePath);
    return mainifest['assets'];
}
exports.get_mainifest_assets = get_mainifest_assets;



//保存成json格式文件
function save_json_file(outName, data, saveBack) {
    rfs.writeFile(outName, JSON.stringify(data, null, 4), function (err) {
        if (err) {
            error('写文件出错：' + outName);
        } else {
            saveBack();
        }
    });
}
exports.save_json_file = save_json_file;

//同步
function save_json_file_sync(outName, data) {
    rfs.writeFileSync(outName, JSON.stringify(data, null, 4));
}
exports.save_json_file_sync = save_json_file_sync;



//json map元素个数
function get_map_length(jsonMap) {
    let count = 0;
    for (let key in jsonMap) {
        count++;
    }
    return count;
}
exports.get_map_length = get_map_length;



//创建多级文件夹
function mkdirs_sync(dirname) {
    if (rfs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirs_sync(rpath.dirname(dirname))) {
            rfs.mkdirSync(dirname);
            return true;
        }
    }
}
exports.mkdirs_sync = mkdirs_sync;



// 读取文件内容生成 md5 值
function file_md5(filePath) {
    let data = rfs.readFileSync(filePath, 'utf-8');
    if (!data) {
        error('生成md5读取文件报错：' + filePath);
    }

    let md5 = rcrypto.createHash('md5');
    let md5Val = md5.update(data.toString()).digest('hex');
    if (!md5Val) {
        error('生成的md5出错：' + filePath);
    }

    return md5Val;
}
exports.file_md5 = file_md5;



