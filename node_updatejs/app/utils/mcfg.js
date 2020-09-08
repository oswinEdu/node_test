
// 文件名
const project_name      = 'project.manifest';
exports.PROJECT_NAME    = project_name;

const version_name      = 'version.manifest';
exports.VERSION_NAME    = version_name;

const updatejson_name   = 'update.json';
exports.UPDATEJSON_NAME = updatejson_name;



// 文件夹里忽略文件
const ignore_files = {
    '.DS_Store': true
};
exports.IGNORE_FILES = ignore_files;

const read_path         = '/Users/wujianchao/Documents/work/node/node_updatejs/data/';
exports.READ_PATH       = read_path;



// 生成文件
const project_file      = read_path + '_out/' + project_name;
exports.PROJECT_FILE    = project_file;

const version_file      = read_path + '_out/' + version_name;
exports.VERSION_FILE    = version_file;

const updatejson_file   = read_path + '_out/' + updatejson_name;
exports.UPDATEJSON_FILE = updatejson_file;


// 原文件md5
const src_path          = read_path + 'src';
exports.SRC_PATH        = src_path;

const srcet_path        = read_path + 'src_et';
exports.SRCET_PATH      = srcet_path;

const res_path          = read_path + 'res';
exports.RES_PATH        = res_path;


// 下载
const down_dir          = read_path + 'down/'
exports.DOWN_DIR        = down_dir;

const down_update       = down_dir + 'update/';
exports.DOWN_UPDATE     = down_update;

const down_project      = down_dir + project_name;
exports.DOWN_PROJECT    = down_project;

const down_version      = down_dir + version_name;
exports.DOWN_VERSION    = down_version;

const down_updatejson   = down_dir + updatejson_name;
exports.DOWN_UPDATEJSON = down_updatejson;


// 配置
const bucket_file       = read_path + '_cfg/bucket_cfg.json';
exports.BUCKET_FILE     = bucket_file;

const update_file       = read_path + '_cfg/update_cfg.json';
exports.UPDATE_FILE     = update_file;