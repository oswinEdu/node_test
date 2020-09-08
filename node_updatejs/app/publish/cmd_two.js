const updatejson    = require('./updatejson');
const mutils        = require('../utils/mutils');
const platform      = require('../platform/platform');
const mainifest     = require('./mainifest');
const mcmd          = require('../utils/mcmd');
const check         = require('../publish/check');


function _waitCmd(sureBack) {
   let appCmd = require('../app');
   appCmd.cmdWaitSure(sureBack);
}

function _finishCmd() {
    let appCmd = require('../app');
    appCmd.cmdFinish();
}



class CmdOne {
    static getInstance() {
        if (!CmdOne.instance) {
            CmdOne.instance = new CmdOne();
        }
        return CmdOne.instance;
    }

    constructor() {
    }

    // 发布内部测试版本
    uploadZeroJson() {
        function zeroYes() {
            platform.uploadYunUpdateJson(_finishCmd);
        }
        updatejson.outZeroJson(function(){
            _waitCmd(zeroYes);
        });
    }


    // 按百分比发布版本
    uploadNumberJson() {
        function numberYes() {
            platform.uploadYunUpdateJson(_finishCmd);
        }
        updatejson.outNumberJson(function() {
            _waitCmd(numberYes);
        });
    }


    // 发布全量版本
    uploadReleaseJson() {
        function releaseYes() {
            platform.uploadYunUpdateJson(_finishCmd);
        }
        updatejson.outReleaseJson(function(){
            _waitCmd(releaseYes);
        });
    }


    // 第一次上传
    uploadFirstJson() {
        function outNewYes() {
            platform.uploadYunUpdateJson(_finishCmd);
        }

        function checkBack(isExit) {
            if (isExit) {
                mutils.error('远端已经存在, 不能上传本地生成 update.json ');
                return;
            }

            _waitCmd(outNewYes);
        }
        check.check_updatejson(checkBack);
    }


    // 上传更新文件 src_et、res、mainifest
    uploadAllFiles() {
        function checkBack() {
            check.check_down_files();
            mcmd.p_blue('完成上传和校验');
            _finishCmd();
        }

        function downFinish() {
            mutils.print('核查中...');
            setTimeout(function(){
                checkBack();
            }, 1000);
        }

        function uploadFinish() {
            mutils.print('下载中...');
            platform.downYunUpdateFiles(downFinish);
        }

        function mainifestYes() {
            mutils.print('上传中...');
            platform.uploadYunUpdateFiles(uploadFinish);
        }
        mainifest.general_mainifest(function(){
            _waitCmd(mainifestYes);
        });
    }
}


module.exports = CmdOne.getInstance();