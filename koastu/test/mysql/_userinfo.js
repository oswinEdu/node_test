// 创建数据库
/*
CREATE DATABASE IF NOT EXISTS nodesample CHARACTER SET UTF8;

USE nodesample;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo`(
    `Id`
    int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
    `UserName`
    varchar(64) NOT NULL COMMENT '用户名',
    `UserPass`
    varchar(64) NOT NULL COMMENT '用户密码',
    PRIMARY KEY(`Id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COMMENT = '用户信息表';

*/

const mysqlHelper = require('../../app/db/mysql-helper.js')

const userinfo = {

    /**
     * 增加一条数据
     * @param  {object} args  参数
     * @return {object}       结果
     */
    async add(args) {
        let sql = 'INSERT INTO userinfo(UserName, UserPass) VALUES(?, ?)'
        let params = [args.username, args.userpass]
        let result = await mysqlHelper.query(sql, params)
        return result
    },

    /**
     * 根据UserName得到一条数据
     * @param  {object} args  参数
     * @return {object}       结果
     */
    async getByUserName(args) {
        let sql = 'SELECT Id, UserName, UserPass FROM userinfo WHERE UserName = ?'
        let params = [args.username]
        let result = await mysqlHelper.query(sql, params)
        return result
    },

    /**
     * 根据UserName得到数量
     * @param  {object} args  参数
     * @return {object}       结果
     */
    async getCountByUserName(args) {
        let sql = 'SELECT COUNT(1) AS UserNum FROM userinfo WHERE UserName = ?'
        let params = [args.username]
        let result = await mysqlHelper.query(sql, params)
        return result
    },

    // 删除
    async delUserByName(args) {
        let sql = 'DELETE FROM userinfo WHERE UserName = ?'
        let params = [args.username]
        let result = await mysqlHelper.query(sql, params)
        return result
    },


    // 修改
    async updateUserByName(args) {
        let sql = 'UPDATE userinfo SET UserPass = ? WHERE UserName = ?'
        let params = [args.userpass, args.username]
        let result = await mysqlHelper.query(sql, params)
        return result
    },

}

module.exports = userinfo