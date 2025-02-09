import { TTypewriterMessage, MultipleTypewriterCommunication, WorkerCommand } from "./MultipleTypewriterCommunication.js";

declare var self: SharedWorkerGlobalScope;

const stationPortMap: Record<number, MessagePort> = {};

self.onconnect = event => {
    const port = event.ports[0]!;
    port.onmessage = event => {
        const data = messageHandler(event, port);
        if (data) {
            port.postMessage(data);
        }
    };
    port.onmessageerror = event => {
        debugger;
    }
}

const multipleTypewriterCommunication = new MultipleTypewriterCommunication();

function messageHandler(event: MessageEvent<TTypewriterMessage>, port: MessagePort) {
    const { command } = event.data;

    switch (command) {
        case WorkerCommand.ReadLineBuffer:
            {
                const buffer = multipleTypewriterCommunication.getLineBuffer(event.data.lineBuffer);
                return buffer.getBuffer();
            }
        case WorkerCommand.WriteLineBuffer:
            {
                const buffer = multipleTypewriterCommunication.getLineBuffer(event.data.lineBuffer);
                for (let i = 0; i < 81; i++) {
                    buffer.writeCharacter7Bit(event.data.data[i]!);
                }
            }
            break;
        case WorkerCommand.GetControlRegister:
            {
                const register = multipleTypewriterCommunication.getStationControlRegister(event.data.station).value().toString();
                return register;
            }
        case WorkerCommand.SetControlRegister:
            {
                const scr = event.data.update;
                const register = multipleTypewriterCommunication.getStationControlRegister(event.data.stationNumber);
                if (scr.F !== undefined)
                    register.F = scr.F;
                if (scr.EN !== undefined)
                    register.EN = scr.EN;
                if (scr.DS !== undefined)
                    register.DS = scr.DS;
                if (scr.RO !== undefined)
                    register.RO = scr.RO;
                if (scr.TO !== undefined)
                    register.TO = scr.TO;
                if (scr.TL !== undefined)
                    register.TL = scr.TL;
                if (scr.CL !== undefined)
                    register.CL = scr.CL;
                if (scr.BN !== undefined)
                    register.BN = scr.BN;
                if (scr.ON !== undefined)
                    register.ON = scr.ON;
                if (scr.OF !== undefined)
                    register.OF = scr.OF;
                if (scr.TC !== undefined)
                    register.TC = scr.TC;
                if (scr.RI !== undefined)
                    register.RI = scr.RI;
                if (scr.RC !== undefined)
                    register.RC = scr.RC;
                if (scr.EJ !== undefined)
                    register.EJ = scr.EJ;
                if (scr.SU !== undefined) {
                    register.SU = scr.SU;
                }

                if (register.CL && !register.TL) {
                    const lineBuffer = multipleTypewriterCommunication.getLineBuffer(register.BN);
                    lineBuffer.clear();
                    register.CL = false;
                }

                if (register.SU) {
                    register.F = false;
                    register.EN = false;
                    register.DS = false;
                    register.RO = false;
                    register.TO = false;
                    // TODO - when TL is set and SU is set, SU waits for TL to complete
                    register.TL = false;
                    register.CL = false;
                    register.OF = false;
                    register.TC = false;
                    register.RI = false;
                    register.RC = false;
                    register.EJ = false;
                }
                if (register.TL) {
                    register.TO = false;
                }

                multipleTypewriterCommunication.setStationControlRegister(event.data.stationNumber, register);
                if (register.SU) {
                    stationPortMap[register.stationNumber]?.postMessage({ switchToUser: true })
                }
                // FIXME- trigger on edge?
                if (register.EN) {
                    stationPortMap[register.stationNumber]?.postMessage({ enable: true })
                }
                if (register.DS) {
                    stationPortMap[register.stationNumber]?.postMessage({ disable: true })
                }
                if (register.TL) {
                    const lineBuffer = multipleTypewriterCommunication.getLineBuffer(register.BN);
                    const characters = lineBuffer.getCharactersToTransmit();
                    for (let character of characters) {
                        stationPortMap[register.stationNumber]?.postMessage({ character })
                    }
                    register.TL = false;
                    register.TO = true;
                    multipleTypewriterCommunication.setStationControlRegister(event.data.stationNumber, register);
                }
            }
            break;
        case WorkerCommand.BufferTransmission:
            {
                const register = multipleTypewriterCommunication.findAssignedRegister(event.data.lineBuffer);
                return !(register?.TL ?? false);
            }

        case WorkerCommand.MatchControlRegister:
            return multipleTypewriterCommunication.findMatchingRegister(event.data.mask, event.data.pattern);
        case WorkerCommand.MismatchControlRegister:
            return multipleTypewriterCommunication.findMismatchRegister(event.data.mask, event.data.pattern);
        case WorkerCommand.JOSSTypewriterMessage:
            {
                const stationControlRegister = multipleTypewriterCommunication.getStationControlRegister(event.data.station);
                if (stationPortMap[event.data.station] === undefined) {
                    stationPortMap[event.data.station] = port;
                }

                if (event.data.on !== undefined) {
                    stationControlRegister.ON = event.data.on;
                }
                if (event.data.off !== undefined) {
                    stationControlRegister.OF = event.data.off;
                }
                if (event.data.character) {
                    const lineBuffer = multipleTypewriterCommunication.getLineBuffer(stationControlRegister.BN);
                    lineBuffer.writeCharacter7Bit(event.data.character);
                }
                if (event.data.carriageReturn !== undefined) {
                    stationControlRegister.RC = event.data.carriageReturn;
                }
                multipleTypewriterCommunication.setStationControlRegister(event.data.station, stationControlRegister);
            }

    }
}