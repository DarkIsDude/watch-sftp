const Client = require('ssh2-sftp-client');
const param = require('./param');
const path = require('path');

function absoluteRemotePath(relativePath) {
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
        const remote = absoluteRemotePath(remoteRelativePath);
        return await sftp.list(remote);
    },
    get: async (remoteRelativePath) => {
        const remote = absoluteRemotePath(remoteRelativePath);
        return await sftp.get(remote);
    },
    put: async (remoteRelativePath) => {
        const remote = absoluteRemotePath(remoteRelativePath);
        return await sftp.put(path.join(param.root, remoteRelativePath), remote);
    },
    mkdir: async (remoteRelativePath) => {
        const remote = absoluteRemotePath(remoteRelativePath);
        return await sftp.mkdir(remote, true);
    },
    rmdir: async (remoteRelativePath) => {
        const remote = absoluteRemotePath(remoteRelativePath);
        return await sftp.rmdir(remote, true);
    },
    delete: async (remoteRelativePath) => {
        const remote = absoluteRemotePath(remoteRelativePath);
        return await sftp.delete(remote);
    }
};