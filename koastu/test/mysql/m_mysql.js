const userinfo = require("./_userinfo")
const utils = require("../utils/m_utils")

const testsql = {
    // 增加数据
    async addData() {
        const args = {
            // username: "随机用户名" + utils.randNum(10),
            username: "随机用户名5",
            userpass: "123456",
        }
        const result = await userinfo.add(args)
        utils.log(result.length)
        utils.jsonlog(result)
    },


    // 查找数据
    async searchByName() {
        const args = {
            username: "随机用户名a"
        }
        const result = await userinfo.getByUserName(args)
        utils.log(result.length)
        utils.jsonlog(result)
    },

    
    // 删除
    async delByName() {
        const args = {
            username: "随机用户名5"
        }
        const result = await userinfo.delUserByName(args)
        utils.jsonlog(result)
    },


    // 修改
    async updateByName() {
        const args = {
            username: "随机用户名",
            userpass: "newpass",
        }
        const result = await userinfo.updateUserByName(args)
        utils.log(result.length)
        utils.jsonlog(result)
    },
}


module.exports = testsql

