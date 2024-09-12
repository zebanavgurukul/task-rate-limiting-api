const cluster = require('cluster');
const os = require('os');
const app = require('./app');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers (number of CPUs)
  for (let i = 0; i < 2; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();  // Restart the worker when it dies
  });
} else {
  // Workers can share any TCP connection
  console.log(`Worker ${process.pid} started`);
  app.listen(process.env.PORT);
}
