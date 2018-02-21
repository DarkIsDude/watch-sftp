const queue = require('queue');

var q = queue({
    autostart: true,
    concurrency: 2
});

q.on('error', (result, job) => {
    console.error(result, job);
});

module.exports = {
    push: (promise) => {
        q.push(promise);
    },
    length: () => q.length,
}
