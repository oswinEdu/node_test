// * https://www.npmjs.com/package/hypertrie
// npm install hypertrie --save

// 引入
const hypertrie = require('hypertrie')
const utils = require("../utils/m_utils")
const process = require("process")

const db = hypertrie('./storage/trie.db', {
    valueEncoding: 'json',
    alwaysUpdate: true
})


const testjson = {
    // ! 1.测试
    async test_hypertrie() {
        // 1.(1)put
        // db.put('hello', 'world', function (err, val) {
        //     if (err != null) {utils.log(err); return;}
        //     utils.log(val['seq']);
        //     utils.log(val['key']);
        //     utils.log(val['value']);
        // });

        // 1.(2)put
        var opts = {
            closest: true,
            batch: false,
        }
        // db.put('hello', 'world4', opts, function(err, val) {
        // // db.put('hello', 'world2', function (err, val) {
        //     if (err != null) {utils.log(err);return;}
        //     utils.jsonlog(val)

        //     process.exit(0)
        // });

        



        // 2.get
        // db.get('hello', function(err, val) {
        //     if (err != null) {utils.log(err);return;}
        //     utils.log(val['seq']);
        //     utils.log(val['key']);
        //     utils.log(val['value']);

        //     process.exit(0)
        // });


        // utils.log(db.key)
    },

}


module.exports = testjson