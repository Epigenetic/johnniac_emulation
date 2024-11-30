const typewriterWorker = new SharedWorker("/Src/MTC/TypewriterWorker.js", { type: "module" });
typewriterWorker.port.start();
const jossWorker = new Worker("/Src/Programs/JOSSWorker.js", { type: "module" });
jossWorker.postMessage({ port: typewriterWorker.port }, [typewriterWorker.port]);
