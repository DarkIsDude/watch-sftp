const watcher = require('./watcher');

watcher.start();

function forever() {
    setTimeout(forever, 1000);
}

forever();