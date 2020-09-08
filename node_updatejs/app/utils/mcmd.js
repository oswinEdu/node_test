const colors        = require('colors');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red'
});


function _print(str) {
    console.log(str);
}


// 输出
function p_red(str) {
    _print(str.error);
}
exports.p_red = p_red;

// 下划线
function p_underline(str) {
    _print(str.underline);
}
exports.p_underline = p_underline;

// 灰色
function p_input(str) {
    _print(str.input);
}
exports.p_input = p_input;

// 黄色
function p_warn(str) {
    _print(str.warn);
}
exports.p_warn = p_warn;

// 红色
function p_prompt(str) {
    _print(str.prompt);
}
exports.p_prompt = p_prompt;

// 蓝色
function p_blue(str) {
    _print(str.data);
}
exports.p_blue = p_blue;

// 绿色
function p_info(str) {
    _print(str.info);
}
exports.p_info = p_info;

// 洋红色
function p_magenta(str) {
    _print(str.debug);
}
exports.p_magenta = p_magenta;

// 彩虹
function p_silly(str) {
    _print(str.silly);
}
exports.p_silly = p_silly;

// 青色
function p_cyan(str) {
    _print(str.help);
}
exports.p_cyan = p_cyan;