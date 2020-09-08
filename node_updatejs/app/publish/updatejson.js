/**
 * 1. 根据 bucket_cfg.json 和 update_cfg.json 生成 _out/update.json
 * 2. 确认云端 update.json 和上一次生成的 _out/update.json 一样
 * 3. 根据 bucket_cfg.json、update_cfg.json、云端下载的down/update.json生成新的 _out/update.json
 * 4. 主要配置文件 bucket_cfg.json 和 update_cfg.json
 * 
 * 5. 待完成功能：回退到上一个版本
 */

const mrbucket  = require('../utils/mrbucket');
const mrupdate  = require('../utils/mrupdate');
const mutils    = require('../utils/mutils');
const mcfg      = require('../utils/mcfg');
const mcmd      = require('../utils/mcmd');
const check     = require('./check');

// update.json 文件字段
let BUCKETS_TAG     = 'tag';
let FIELD_BUCKET    = 'buckets';

let TAG_RELEASE     = 0;
let TAG_NUMBER      = 1;
let TAG_ZERO        = 2;
let TAG_LAST        = 3;

let NEXT_VERSION    = 1;


class UpdateJson {
    static getInstance() {
        if (!UpdateJson.instance) {
            UpdateJson.instance = new UpdateJson();
        }
        return UpdateJson.instance;
    }

    constructor() {
    }

    // 提示
    _showPrompt(jdata) {
        mutils.print('');
        function promptFunc(str) {
            mcmd.p_red('  ⚠️️  ' + str);   
        }

        if (jdata['is_part_update']) {
            promptFunc('是否是部分更新：是');
        } else {
            promptFunc('是否是部分更新：否');
            promptFunc('是否是全量更新：是');
        }

        promptFunc('灰度更新万分之：' + jdata['ten_thousand']);
    }


    _setJsonDataAndSave(jdata, bucketList) {
        this._checkBucketList(bucketList);
        jdata[FIELD_BUCKET] = bucketList;

        this._showPrompt(jdata);
        mutils.save_json_file_sync(mcfg.UPDATEJSON_FILE, jdata);
    }


    // 1.tenThousand：灰度更新万分之几
    // 2.isPartUpdate：是否是部分更新
    // 3.isLastBack：是否是回退到上一个版本
    _getJsonData(tenThousand, isPartUpdate, isLastBack) {
        let jdata = {};
        jdata['ten_thousand'] = tenThousand;
        jdata['is_part_update'] = isPartUpdate;
        jdata['is_last_back'] = isLastBack;
        jdata['devices_id'] = mrupdate.devices_id();
        jdata['user_id'] = mrupdate.user_id();

        return jdata;
    }


    // 1.数组 bucketList 长度大于等于2
    // 2.属性 tag 值必须 0~length-1 不能重复
    _checkBucketList(bucketList) {
        let len = bucketList.length;
        if(len < 2) {
            mutils.error('核查 BucketList 数组长度小于2');
        }

        let tagList = [];
        for (let i = 0; i < len; i++) {
            let tagVal = bucketList[i][BUCKETS_TAG];
            tagList.push(tagVal);
        }

        tagList.sort();
        for (let i = 0; i < tagList.length; i++) {
            if (i !== tagList[i]) {
                mutils.error('核查 BucketList 出错');
            }
        }
    }


    // 发布正式版本更新 bucketList 数组的各个 tag(-1) 值
    _subBucketTag(bucketList) {
        let maxTag = bucketList.length - 1;
        let minTag = 0

        for (let i = 0; i < maxTag; i++) {
            let bucket = bucketList[i];
            let tag = bucket[BUCKETS_TAG] - 1;

            if (tag < minTag) {
                tag = minTag;
            } else if (tag > maxTag) {
                tag = maxTag;
            }

            bucket[BUCKETS_TAG] = tag;
        }
    }


    _commonData(jdata, tag, backFunc) {
        function checkBack(isSuccess) {
            if (!isSuccess) {
                mutils.error('下载或核查 update.json 文件失败');
                return;
            }

            let data = mutils.read_json_file_sync(mcfg.DOWN_UPDATEJSON);
            let bucketList = data[FIELD_BUCKET];

            if (tag == TAG_RELEASE) {
                UpdateJson.getInstance()._subBucketTag(bucketList);
            }

            UpdateJson.getInstance()._setJsonDataAndSave(jdata, bucketList);
            backFunc();
        }

        // 创建新的json文件之前核查云端 update.json 和 本地_out/update.json 是否相等
        check.check_updatejson(checkBack)
    }



    // 内部设备测试
    outZeroJson(backFunc) {
        let jdata = this._getJsonData(0, true, false);
        this._commonData(jdata, TAG_ZERO, backFunc);
    }


    // 万分之几灰度测试
    outNumberJson(backFunc) {
        let valPercent = mrupdate.update_percent();
        let jdata = this._getJsonData(valPercent, true, false);
        this._commonData(jdata, TAG_NUMBER, backFunc);
    }


    // 正式发布
    outReleaseJson(backFunc) {
        let jdata = this._getJsonData(0, false, false);
        this._commonData(jdata, TAG_RELEASE, backFunc);
    }


    // 根据本地 bucket_cfg、update_cfg 生成 update.json
    outNewJson(backFunc) {
        let jdata = this._getJsonData(0, true, false);
        this._setJsonDataAndSave(jdata, mrbucket.buckets());
        backFunc();
    }


    // 回退到上一个版本
    outLastJson() {

    }



    // 1.调用方法前一定先生成 _out/update.json
    // 2.获得下个版本 bucket
    getNextVersionBucket() {
        let jdata = mutils.read_json_file_sync(mcfg.UPDATEJSON_FILE);
        let bucketList = jdata[FIELD_BUCKET];
        this._checkBucketList(bucketList);

        for(let i=0; i<bucketList.length; i++) {
            let bucket = bucketList[i];
            if(bucket[BUCKETS_TAG] === NEXT_VERSION) {
                return bucket['bucket_name'];
            }
        }

        mutils.error('update.json buckets tag属性没有等于1值');
    }
}


module.exports = UpdateJson.getInstance();

