const mutils        = require('../utils/mutils');
const mcfg          = require('../utils/mcfg');


// project.mainifest 生成 MD5 文件和文件夹里的文件是否一样
function check_manifest(fileList, mainifestPath, cutPath) {
    let assets = mutils.get_mainifest_assets(mainifestPath);

    // 1.文件数量
    let assetsNum = mutils.get_map_length(assets)
    if (assetsNum !== fileList.length) {
        mutils.error('res src 和 mainifest assets 文件数量不相等');
    }

    // 2.文件名
    for (let i = 0; i < fileList.length; i++) {
        let filePath = fileList[i];
        let name = mutils.cut_path_file(cutPath, filePath);
        if (!assets[name]) {
            mutils.error('res src 和 mainifest assets 文件名不一样\n' + name);
        }
    }

    mutils.print('核查 mainifest 数量和文件名完成');
}
exports.check_manifest = check_manifest;



// 下载文件夹down里的文件和project.mainifest里的进行md5对比
function check_down_files() {
    let downFiles = mutils.get_all_files(mcfg.DOWN_UPDATE);
    check_manifest(downFiles, mcfg.PROJECT_FILE, mcfg.DOWN_UPDATE);
    let assets = mutils.get_mainifest_assets(mcfg.PROJECT_FILE);

    for(let i=0; i<downFiles.length; i++) {
        let filePath = downFiles[i];
        let md5Val = mutils.file_md5(filePath);
        let md5Key = filePath.replace(mcfg.DOWN_UPDATE, '');
        if(assets[md5Key] !== md5Val) {
            mutils.error('md5 计算不一样 \n' + md5Val);
        }
    }

    // 核查project、version、update.json md5值
    let downs = [mcfg.DOWN_VERSION, mcfg.DOWN_PROJECT];
    let outs = [mcfg.VERSION_FILE, mcfg.PROJECT_FILE];
    for(let i=0; i<downs.length; i++) {
        let md5Down = mutils.file_md5(downs[i]);
        let md5Out = mutils.file_md5(outs[i]);

        if(md5Down !== md5Out) {
            mutils.error('md5 mainifest 计算不一样\n' + downs[i]);
        }
    }

    mutils.print('核查down文件夹和mainifest md5完成');
}
exports.check_down_files = check_down_files;



// 1.下载云端 update.json 到 down文件夹
// 2.down/update.json 和 _out/update.json 内容md5对比
function check_updatejson(checkBack) {
    let platform = require('../platform/platform');

    function downBack() {
        let md5Out = mutils.file_md5(mcfg.UPDATEJSON_FILE);
        let md5Down = mutils.file_md5(mcfg.DOWN_UPDATEJSON);
        if (md5Out !== md5Down) {
            mutils.print('\n  ⚠️ md5 update.json 不相等');
            checkBack(false);
        }
        checkBack(true);
    }

    function judgeBack(isExist) {
        if (!isExist) {
            mutils.print('\n  ⚠️ 云端没有 update.json 文件');
            checkBack(false);
            return;
        }

        platform.downYunUpdateJson(downBack);
    }

    platform.judgeYunUpdateJson(judgeBack);
}


exports.check_updatejson = check_updatejson;

