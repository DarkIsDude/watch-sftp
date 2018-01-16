const path = require('path');

const ROOT = path.resolve('../hosco-v2.git');

module.exports = {
    sftp: {
        private_key_path: path.resolve('/Users/doudou/.ssh', 'id_rsa'),
        host: 'ecomtet.com',
        username: 'root',

        root: '/tmp/hosco',
    },
    root: ROOT,
    ignored: [
        path.resolve(ROOT, 'node_modules'),
        path.resolve(ROOT, '.git'),
        path.resolve(ROOT, '.idea'),
    ]
}