const cmdOne        = require('./publish/cmd_one');
const cmdTwo        = require('./publish/cmd_two');
const mcmd          = require('./utils/mcmd');
const readline      = require('readline');


class AppCmd {
    static getInstance() {
        if (!AppCmd.instance) {
            AppCmd.instance = new AppCmd();
        }
        return AppCmd.instance;
    }

    constructor() {
        this.rl = null;
        this.yesBack = null;
        this.befInput = '0';
        this.prompt1 = '选择> ';
        this.prompt2 = '输入> ';

        this.initCmd();
    }


    initCmd() {
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.rl = rl;
        let obj = this;

        rl.on('line', function(line){
            obj.lineCmd(line);
        });

        rl.on('close', function () {
            mcmd.p_silly(' 完成！');
            process.exit(0);
        });

        this.setStartCmd();
    }


    setOneCmd() {
        mcmd.p_input('');
        mcmd.p_input(' 1.生成mainifest');
        mcmd.p_input(' 2.下载并核查云端update.json');
        mcmd.p_input(' 3.生成本地update.json');
        mcmd.p_input(' 4.返回\n');

        this.befInput = '1';
        this.rl.setPrompt(this.prompt1);
        this.rl.prompt();
    }

    setTwoCmd() {
        mcmd.p_input('');
        mcmd.p_input(' 1.发布内部测试版本');
        mcmd.p_input(' 2.发布万分比版本');
        mcmd.p_input(' 3.发布全量版本');
        mcmd.p_input(' 4.第一次上传update.json');
        mcmd.p_input(' 5.上传更新文件src_et、res、mainifest');
        mcmd.p_input(' 6.返回\n');

        this.befInput = '2';
        this.rl.setPrompt(this.prompt1);
        this.rl.prompt();
    }

    setStartCmd() {
        mcmd.p_input('');
        mcmd.p_input(' 1.生成文件');
        mcmd.p_input(' 2.发布版本');
        mcmd.p_input(' 3.退出\n');

        this.befInput = '0';
        this.rl.setPrompt(this.prompt1);
        this.rl.prompt();
    }


    lineCmd(line) {
        let rl = this.rl
        let tag = this.befInput + line.trim();
        switch (tag) {
            case '01':
                this.setOneCmd();
                break;
            case '02':
                this.setTwoCmd();
                break;
            case '03':
                rl.close();
                break;

            case '11':
                cmdOne.outMainifest();
                break;
            case '12':
                cmdOne.downUpdatejson();
                break;
            case '13':
                cmdOne.outNewUpdatejson();
                break;
            case '14':
                this.setStartCmd();
                break;

            case '21':
                cmdTwo.uploadZeroJson();
                break;
            case '22':
                cmdTwo.uploadNumberJson();
                break;
            case '23':
                cmdTwo.uploadReleaseJson();
                break;
            case '24':
                cmdTwo.uploadFirstJson();
                break;
            case '25':
                cmdTwo.uploadAllFiles();
                break;
            case '26':
                this.setStartCmd();
                break;

            case 'yes':
                this.yesBack();
                break;
            case 'no':
                rl.close();
                break;

            default:
                mcmd.p_warn('没有找到命令!');
                break;
        }

        // 每次调用出现输入提示
        // rl.prompt();
    }


    cmdWaitSure(yesBack) {
        this.yesBack = yesBack;
        mcmd.p_prompt('');
        mcmd.p_prompt(' update.json');
        mcmd.p_warn(' 请核查 _out/update.json 生成结果是否正确');
        mcmd.p_warn(' 请确定您的选项《输入yes继续、输入no取消》');
        mcmd.p_prompt('');

        this.befInput = '';
        this.rl.setPrompt(this.prompt2);
        this.rl.prompt();
    }

    cmdFinish() {
        this.rl.close();
    }
}

module.exports = AppCmd.getInstance();