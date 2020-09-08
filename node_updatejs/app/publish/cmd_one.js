const mainifest     = require('./mainifest');
const updatejson    = require('./updatejson');
const mutils        = require('../utils/mutils');
const mcmd          = require('../utils/mcmd');
const check         = require('../publish/check');

function _showPrompt(str) {
    mcmd.p_blue(str);

    let appCmd = require('../app');
    appCmd.cmdFinish();
}


class CmdTwo {
    static getInstance() {
        if (!CmdTwo.instance) {
            CmdTwo.instance = new CmdTwo();
        }
        return CmdTwo.instance;
    }
    constructor() {
    }

    
    // 生成mainifest
    outMainifest() {
        mainifest.general_mainifest(function() {
            _showPrompt('生成 src_et、res、mainifest完成');
        });
    }


    // 下载云端update.json(先下载在核查)
    downUpdatejson() {
        function checkBack(isSuccess) {
            if (!isSuccess) {
                mutils.error('下载或核查 update.json 文件失败');
                return;
            }

            _showPrompt('下载完成请查看 down/update.json');
        }
        check.check_updatejson(checkBack);
    }


    // 生成本地update.json
    outNewUpdatejson() {
        updatejson.outNewJson(function(){
            _showPrompt('bucket_cfg和update_cfg =>> _out/update.json');
        });
    }
}


module.exports = CmdTwo.getInstance();