const cluster = require('node:cluster');
const os = require('node:os');

if (cluster.isPrimary) {
    const n = os.availableParallelism();
    console.log(`Primary ${process.pid} démarre ${n} workers`);
    for (let i = 0; i < n; i++) cluster.fork();
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} mort, relance`);
        cluster.fork();
    });
} else {
    const app = require('./app');
    app.listen(3000, () => console.log(`Worker ${process.pid} en écoute`));
}