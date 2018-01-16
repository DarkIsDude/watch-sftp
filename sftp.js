const Client = require('ssh2-sftp-client');
const param = require('./param');
const path = require('path');

function joinPath(relativePath) {
    return path.join(param.sftp.root, relativePath);
}

const sftp = new Client();
module.exports = {
    connect: async () => {
        await sftp.connect({
            host: param.sftp.host,
            port: 22,
            username: param.sftp.username,
            privateKey: require('fs').readFileSync(param.sftp.private_key_path),
        });
    },
    list: async (remoteRelativePath) => {
        return await sftp.list(joinPath(remoteRelativePath));
    },
    get: async (remoteRelativePath) => {
        return await sftp.get(joinPath(remoteRelativePath));
    },
    put: async (localRelativePath, remoteRelativePath) => {
        return await sftp.put(localRelativePath, joinPath(remoteRelativePath));
    },
    mkdir: async (remoteRelativePath) => {
        return await sftp.mkdir(joinPath(remoteRelativePath), true);
    },
    rmdir: async (remoteRelativePath) => {
        return await sftp.rmdir(joinPath(remoteRelativePath), true);
    },
    delete: async (remoteRelativePath) => {
        return await sftp.delete(joinPath(remoteRelativePath));
    }
};