const { parentPort, workerData } = require("worker_threads");

parentPort.postMessage(approve(workerData.didApprove));

function approve(med) {
    console.log(`med ${med}`);
    console.log(parentPort.ppid);
    console.log(parentPort.pid);
    return med;
}