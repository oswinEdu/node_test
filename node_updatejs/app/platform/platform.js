const rmutils       = require('../utils/mutils');
const rmcfg         = require('../utils/mcfg');
const maliyun       = require('./maliyun');
const mrbucket      = require('../utils/mrbucket');
const updatejson    = require('../publish/updatejson');

class Platform {
    static getInstance() {
        if (!Platform.instance) {
            Platform.instance = new Platform();
        }
        return Platform.instance;
    }

    constructor() {
    }


    // src_et、res、两个 mainifest
    uploadYunUpdateFiles(uploadBack) {
        let bucket = updatejson.getNextVersionBucket();
        maliyun.uploadFiles(bucket, uploadBack);
    }

    // src_et、res、两个 mainifest
    downYunUpdateFiles(downBack) {
        let bucket = updatejson.getNextVersionBucket();
        rmutils.delete_dir(rmcfg.DOWN_DIR);
        rmutils.mkdirs_sync(rmcfg.DOWN_DIR);

        maliyun.downFiles(bucket, downBack);
    }


    // out/update.json
    uploadYunUpdateJson(uploadJsonBack) {
        maliyun.uploadUpdateJson(mrbucket.main_bucket(), uploadJsonBack);
    }

    // down/update.json
    downYunUpdateJson(downJsonBack) {
        rmutils.delete_file(rmcfg.DOWN_UPDATEJSON);
        maliyun.downUpdateJson(mrbucket.main_bucket(), downJsonBack);
    }


    // 判断云端 update.json 是否存在
    judgeYunUpdateJson(judgeBack) {
        let bucket = mrbucket.main_bucket();
        maliyun.judgeUpdateJson(bucket, judgeBack);
    }
}


module.exports = Platform.getInstance()



