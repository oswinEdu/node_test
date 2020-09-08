let rmutils     = require('./mutils')
let rmcfg       = require('./mcfg')

class MRUpdate {
    static getInstance() {
        if (!MRUpdate.instance) {
            MRUpdate.instance = new MRUpdate();
        }
        return MRUpdate.instance;
    }

    constructor() {
        this.json = rmutils.read_json_file_sync(rmcfg.UPDATE_FILE);
    }

    update_version() {
        return this.json['update_version'];
    }

    update_percent() {
        return this.json['ten_thousand'];
    }

    devices_id() {
        return this.json['devices_id'];
    }

    user_id() {
        return this.json['user_id'];
    }
}

module.exports = MRUpdate.getInstance();
