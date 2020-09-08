const mrbucket  = require('../utils/mrbucket');
const mrupdate  = require('../utils/mrupdate');
const mutils    = require('../utils/mutils');
const mcfg      = require('../utils/mcfg');

let MAX_PERCENT = 10000;
let MIN_PERCENT = 0;

let FIELD_TAG = 'tag';

class Publish {
    static getInstance() {
        if (!Publish.instance) {
            Publish.instance = new Publish();
        }
        return Publish.instance;
    }

    constructor() {
        this._init();
    }

    _init() {
        this.data = {};
    }


    _checkBucketList(bucketList) {
        let len = bucketList.length;
        let tagList = [];
        for (let i = 0; i < len; i++) {
            let tagVal = bucketList[i][FIELD_TAG];
            tagList.push(tagVal);
        }

        tagList.sort();
        for (let i = 0; i < tagList.length; i++) {
            if(i !== tagList[i]) {
                mutils.error('核查 BucketList 出错');
            }
        }
    }


    _subBucketTag(bucketList) {
        let maxTag = bucketList.length - 1;
        let minTag = 0

        for (let i = 0; i < maxTag; i++) {
            let bucket = bucketList[i];
            let tag = bucket[FIELD_TAG] - 1;

            if (tag < minTag) {
                tag = minTag;
            } else if (tag > maxTag) {
                tag = maxTag;
            }

            bucket[FIELD_TAG] = tag;
        }
    }


    _saveNewUpdate() {
        mutils.save_json_file_sync(mcfg.UPDATEJSON_FILE, this.data);
    }

    _commonData() {
        this.data['devices_id'] = mrupdate.devices_id();
        this.data['user_id'] = mrupdate.user_id();

        let bucketList = mrbucket.buckets();
        this._checkBucketList(bucketList);
        this.data['buckets'] = bucketList;
    }


    // 内部设备测试
    cmdPZero() {
        this._init();
        this.data['ten_thousand'] = MIN_PERCENT;
        this.data['is_part_update'] = true;
        this._common_data();
    }

    // 万分之几灰度测试
    cmdPNumber() {
        this._init();
        this.data['ten_thousand'] = mrupdate.update_percent();
        this.data['is_part_update'] = true;
        this._common_data();
    }

    // 正式发布
    cmdPRelease(bucketList) {
        this._init();
        this.data['ten_thousand'] = MIN_PERCENT;
        this.data['is_part_update'] = false;
        this._common_data();
        this._subBucketTag(bucketList);
    }



    cmdOutUpdateJson() {
        this._init();
    }

    // 根据本地 bucket_cfg、update_cfg 生成 update.json
    cmdOutLocalUpdateJson() {
        this._init();
        this.data['ten_thousand'] = MIN_PERCENT;
        this.data['is_part_update'] = false;

        this._commonData();
        this._saveNewUpdate();
    }

}

module.exports = Publish.getInstance();


Publish.getInstance().commandOutUpdateJson()
