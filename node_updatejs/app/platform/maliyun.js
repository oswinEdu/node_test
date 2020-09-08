const ross      = require('ali-oss');
const rmutils   = require('../utils/mutils');
const rmcfg     = require('../utils/mcfg');
const rmcmd     = require('../utils/mcmd');


class MAliyun{
    static getInstance() {
        if (!MAliyun.instance) {
            MAliyun.instance = new MAliyun();
        }
        return MAliyun.instance;
    }


    constructor() {
        let client = ross({
            accessKeyId: 'LTAI4Fk2rfJQHXQxNt94EPRQ',
            accessKeySecret: '9spupchcHbBZgwDGn10Ug0AdEv7a4K',
            // bucket: 'test-wjh-useall',
            region: 'oss-cn-beijing'
        });
        client.useBucket('test-wjh-useall');
        // client.useBucket('test-down-file');
        this.client = client;
    }

    _useBucket(bucket) {
        rmcmd.p_magenta('  当前bucket是：' + bucket);
        this.client.useBucket(bucket);
    }


    async _aliyunDown(fileName, fileLocalPath, downBack) {
        try {
            // rmcmd.p_input('  下载文件：' + fileName);
            let result = await this.client.get(fileName, fileLocalPath);
        } catch (err) {
            rmutils.error('阿里云-下载文件出错\n ' + err);
        }

        rmcmd.p_info('  下载完成：' + fileName);
        downBack(fileName);
    }


    async _aliyuPut(fileLocalPath, fileName, putBack) {
        try {
            // rmcmd.p_input('  上传文件...：' + fileName);
            let result = await this.client.put(fileName, fileLocalPath);
        } catch (err) {
            rmutils.error('阿里云-上传文件出错\n' + err);
        }
        rmcmd.p_info('  上传完成...：' + fileName);
        putBack(fileName);
    }


    _aliyunCheckFile(fileName, backFunc) {
        this.client.get(fileName).then((result) => {
            if (result.res.status == 200) {
                backFunc(true);
                return true;
            }
        }).catch((e) => {
            if (e.code == 'NoSuchKey') {
                backFunc(false);
                return false
            } else {
                rmutils.error('判断阿里云文件是否存在出错： ' + e);
            }
        });
    }


    uploadFiles(bucketName, uploadBack) {
        this._useBucket(bucketName);

        let arrs = rmutils.get_upload_files();
        let arrLen = arrs.length + 2;
        let map = {};

        function putFinish(name) {
            arrLen--;
            delete map[name];
            if(arrLen == 0 && rmutils.get_map_length(map) == 0) {
                rmutils.print('上传完成'+rmutils.get_map_length(map));
                uploadBack();
            }else if(arrLen < 0) {
                rmutils.error('下载回调数量出错');
            }
        }

        for (let i = 0; i < arrs.length; i++) {
            let filePath = arrs[i];
            let fileName = rmutils.cut_path_file(rmcfg.READ_PATH, filePath);
            map[fileName] = true;
            this._aliyuPut(filePath, fileName, putFinish);
        }

        map[rmcfg.PROJECT_NAME] = true;
        map[rmcfg.VERSION_NAME] = true;
        // 上传 manifest 《arrs.length + 2;》
        this._aliyuPut(rmcfg.PROJECT_FILE, rmcfg.PROJECT_NAME, putFinish);
        this._aliyuPut(rmcfg.VERSION_FILE, rmcfg.VERSION_NAME, putFinish);
    }


    downFiles(bucketName, downFinish) {
        this._useBucket(bucketName);

        let arrs = rmutils.get_upload_files();
        let arrLen = arrs + 2;
        let map = {};

        function downBack(name) {
            arrLen--;
            delete map[name];
            if(arrLen == 0 && rmutils.get_map_length(map) == 0) {
                rmutils.print('下载完成');
                downFinish();
            }else if(arrLen < 0) {
                rmutils.error('下载回调数量出错');
            }
        }

        for (let i = 0; i < arrs.length; i++) {
            let filePath = arrs[i];
            let fileName = rmutils.cut_path_file(rmcfg.READ_PATH, filePath);
            map[fileName] = true;
            let downPath = rmcfg.DOWN_UPDATE + fileName;
            let mkdir = rmutils.get_filedir(downPath);
            rmutils.mkdirs_sync(mkdir);

            this._aliyunDown(fileName, downPath, downBack);
        }

        map[rmcfg.PROJECT_NAME] = true;
        map[rmcfg.VERSION_NAME] = true;
        // 下载 mainifest 《arrs + 2》
        this._aliyunDown(rmcfg.PROJECT_NAME, rmcfg.DOWN_PROJECT, downBack);
        this._aliyunDown(rmcfg.VERSION_NAME, rmcfg.DOWN_VERSION, downBack);
    }



    uploadUpdateJson(bucketName, uploadBack) {
        this._useBucket(bucketName);
        this._aliyuPut(rmcfg.UPDATEJSON_FILE, rmcfg.UPDATEJSON_NAME, uploadBack);
    }

    downUpdateJson(bucketName, downBack) {
        this._useBucket(bucketName);
        this._aliyunDown(rmcfg.UPDATEJSON_NAME, rmcfg.DOWN_UPDATEJSON, downBack);
    }

    // 1.判断某个文件是否存在 如：src_et/aa/cfgconfig.luac
    // 2.backFunc(isExist)
    judgeUpdateJson(bucketName, backFunc) {
        this._useBucket(bucketName);
        this._aliyunCheckFile(rmcfg.UPDATEJSON_NAME, backFunc);
    }
}

module.exports = MAliyun.getInstance();

// MAliyun.getInstance().uploadFiles('test-down-file', function(){});


