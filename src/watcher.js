const chokidar = require('chokidar');
const path = require('path');
const param = require('./param');
const sftp = require('./sftp');
const queue = require('./queue');

function relativePath(absolutePath) {
    return path.relative(param.root, absolutePath);
}

function logDate() {
    function pad(value) {
        const string = value.toString();
        return string.length == 2 ? string : "0" + string;
    }

    const now = new Date();

    return pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
}

function processEvent(eventPath, action, debugType, debugAction) {
    queue.push(() => {
        return new Promise(async (resolve, reject) => {
            try {
                console.info(`${ logDate() } ${ debugType } ${ eventPath } must be ${ debugAction }`);
                await action(relativePath(eventPath));
                console.info(`${ logDate() } ${ debugType } ${ eventPath } has been ${ debugAction }`);
                resolve();
            } catch (e) {
                reject(e);
                console.error(`${ logDate() } ${ debugType } ${ eventPath } hasn\'t been ${ debugAction }`);
            }
        });
    });
}

async function start () {
    try {
        await sftp.connect();
    } catch (e) {
        throw e;
    }

    const watcher = chokidar.watch(param.root, {
        ignored: param.ignored,
        ignoreInitial: true,
        followSymlinks: true,
    });

    watcher
        .on('add', (eventPath) => processEvent(eventPath, sftp.put, 'File', 'added'))
        .on('change', (eventPath) => processEvent(eventPath, sftp.put, 'File', 'changed'))
        .on('unlink', (eventPath) => processEvent(eventPath, sftp.delete, 'File', 'removed'));

    // More possible events.
    watcher
        .on('addDir', (eventPath) => processEvent(eventPath, sftp.mkdir, 'Directory', 'added'))
        .on('unlinkDir', (eventPath) => processEvent(eventPath, sftp.rmdir, 'Directory', 'removed'))

    watcher
        .on('error', async (error) => {
            console.error(`Watcher error: ${ error }`);
            throw error;
        })
        .on('ready', async () => {
            console.info('Initial scan complete. Ready for changes');
            console.info(`We read ${ (await sftp.list('./')).length } at the root`);
        });
}

module.exports = {
    start: start
}
