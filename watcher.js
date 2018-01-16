const chokidar = require('chokidar');
const param = require('./param');
const sftp = require('./sftp');

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
        .on('add', async (path) => {
            // PUT
            console.log(`File ${ path } has been added`);
        })
        .on('change', async (path) => {
            // PUT
            console.log(`File ${ path } has been changed`);
        })
        .on('unlink', async (path) => {
            // DELETE
            console.log(`File ${ path } has been removed`);
        });

    // More possible events.
    watcher
        .on('addDir', async (path) => {
            // MKDIR
            console.log(`Directory ${ path } has been added`)
        })
        .on('unlinkDir', async (path) => {
            // RMDIR
            console.log(`Directory ${ path } has been removed`)
        });

    watcher
        .on('error', async (error) => {
            console.error(`Watcher error: ${ error }`);
            throw error;
        })
        .on('ready', async () => {
            console.info('Initial scan complete. Ready for changes');
            console.info(await sftp.list(param.sftp.root));
        });
}

module.exports = {
    start: start
}