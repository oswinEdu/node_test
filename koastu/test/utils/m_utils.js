const utils = {
    randNum(num) {
        return Math.floor(Math.random() * num)
    },

    log(msg) {
        console.log('!')
        console.log('test_log:' + msg)
    },

    jsonlog(json) {
        this.log(JSON.stringify(json))
    },
}


module.exports = utils