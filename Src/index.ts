import { JOSSTypewriter } from "./JOSSTypewriter.js";

declare global {
    var typewriter: JOSSTypewriter | undefined;
}

const typewriterWorker = new SharedWorker("/Src/MTC/TypewriterWorker.js", { type: "module" });
typewriterWorker.port.start();
const jossWorker = new Worker("/Src/Programs/JOSSWorker.js", { type: "module" });
jossWorker.postMessage({ port: typewriterWorker.port }, [typewriterWorker.port]);

globalThis.typewriter = new JOSSTypewriter(0, document.getElementById("jossInput")! as HTMLDivElement);
globalThis.typewriter.online();
