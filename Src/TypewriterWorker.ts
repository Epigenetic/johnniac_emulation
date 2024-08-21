import { TTypewriterMessage, MultipleTypewriterCommunication, WorkerCommand } from "./MultipleTypewriterCommunication.js";

declare var self: SharedWorkerGlobalScope;

self.onconnect = event => {
    const port = event.ports[0]!;
    port.onmessage = event => {
        port.postMessage(messageHandler(event));
    };
}

const multipleTypewriterCommunication = new MultipleTypewriterCommunication();

function messageHandler(event: MessageEvent<TTypewriterMessage>) {
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
                if (scr.TL !== undefined)
                    register.TL = scr.TL;
                if (scr.CL !== undefined)
                    register.CL = scr.CL;
                if (scr.SU !== undefined)
                    register.SU = scr.SU;
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
                if (scr.TO !== undefined)
                    register.TO = scr.TO;

                multipleTypewriterCommunication.setStationControlRegister(event.data.stationNumber, register);
            }
            break;
        case WorkerCommand.BufferTransmission:
            {
                const register = multipleTypewriterCommunication.findAssignedRegister(event.data.lineBuffer);
                return !(register?.TL ?? false);
            }

        case WorkerCommand.MatchControlRegister:
            return multipleTypewriterCommunication.findMatchingRegister(event.data.pattern);
        case WorkerCommand.MismatchControlRegister:
            return multipleTypewriterCommunication.findMismatchRegister(event.data.pattern);
    }
}