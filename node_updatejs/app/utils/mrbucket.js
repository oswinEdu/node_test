let rmutils = require('./mutils')
let rmcfg = require('./mcfg')

class MRBucket {
    static getInstance() {
        if (!MRBucket.instance) {
            MRBucket.instance = new MRBucket();
        }
        return MRBucket.instance;
    }

    constructor() {
        this.json = rmutils.read_json_file_sync(rmcfg.BUCKET_FILE);
    }

    init() {
    }

    main_bucket() {
        return this.json['main_bucket'];
    }

    main_domain() {
        return this.json['main_domain'];
    }

    buckets() {
        return this.json['buckets'];
    }
}

module.exports = MRBucket.getInstance();
