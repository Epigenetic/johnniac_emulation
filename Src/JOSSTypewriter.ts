import { Backspace, CarriageReturn, CarriageReturnAndEndOfMessage, EjectAndCarriageReturn, EjectCarriageReturnAndEndOfMessage, EndOfMessage, ShiftLowerCase, ShiftUpperCase, SixBitCharactersLowercase, SixBitCharactersLowercaseReverse, SixBitCharactersUppercase, SixBitCharactersUppercaseReverse, Space, Tab, validateCharacter } from "./Characters.js";
import { TTypewriterMessage, WorkerCommand } from "./MTC/MultipleTypewriterCommunication.js"

export class JOSSTypewriter {
    private _stationNumber: number;

    private _power = true; // TODO - does this make sense to have?
    private _enable = false;
    private _online = false;
    private _ready = false;
    private _state = State.Red;
    private _ribbonColor = RibbonColor.Black;
    private _typewriterWorker: SharedWorker;
    private _case = Case.LowerCase;
    private _input: HTMLInputElement;
    private _output: HTMLDivElement;
    private _statusLights: HTMLDivElement;

    constructor(stationNumber: number, input: HTMLInputElement, output: HTMLDivElement, statusLights: HTMLDivElement) {
        this._stationNumber = stationNumber;
        this._input = input;
        this._output = output;
        this._statusLights = statusLights;
        this._typewriterWorker = new SharedWorker("/Src/MTC/TypewriterWorker.js", { type: "module" });
        this._typewriterWorker.port.onmessage = event => this._onMTCMessage(event.data);
        this._typewriterWorker.port.onmessageerror = event => { debugger };
        this._input.addEventListener("input", event => this._onInput(event as InputEvent))
        this._input.addEventListener("keyup", event => this._onKeyUp(event))
        this._updateLights();
    }

    public online(): void {
        this._online = true;
        const message: TTypewriterMessage = {
            command: WorkerCommand.JOSSTypewriterMessage,
            station: this._stationNumber,
            on: true,
        }
        this._typewriterWorker.port.postMessage(message);
    }

    public offline(): void {
        this._online = false;
        const message: TTypewriterMessage = {
            command: WorkerCommand.JOSSTypewriterMessage,
            station: this._stationNumber,
            off: true,
        };
        this._typewriterWorker.port.postMessage(message);
    }

    private _sendCharacter(character: number): void {
        const message: TTypewriterMessage = {
            command: WorkerCommand.JOSSTypewriterMessage,
            station: this._stationNumber,
            character,
        };
        this._typewriterWorker.port.postMessage(message);
    }

    private _onMTCMessage(message: IMTCMessage) {
        if (!message) {
            return;
        }
        if (message.enable)
            this._enable = true;
        if (message.disable) {
            this._enable = false;
            this._online = false;
        }
        if (message.switchToUser) {
            this._state = State.Green;
        }
        if (message.character) {
            switch (message.character) {
                case ShiftUpperCase:
                    this._case = Case.UpperCase;
                    break;
                case ShiftLowerCase:
                    this._case = Case.LowerCase;
                    break;
                case EjectAndCarriageReturn:
                    // TODO- make better representation of new page
                    this._output.insertAdjacentHTML("beforeend", "<br/><br/>");
                    break;
                case EjectCarriageReturnAndEndOfMessage:
                    // TODO- make better representation of new page
                    this._output.insertAdjacentHTML("beforeend", "<br/><br/>");
                    this._ribbonColor = RibbonColor.Green;
                    break
                case CarriageReturn:
                    this._output.insertAdjacentHTML("beforeend", "<br/>");
                    break;
                case CarriageReturnAndEndOfMessage:
                    this._output.insertAdjacentHTML("beforeend", "<br/>");
                    this._ribbonColor = RibbonColor.Green;
                    break;
                case EndOfMessage:
                    this._ribbonColor = RibbonColor.Green;
                    break;
                case Tab:
                    this._output.insertAdjacentHTML("beforeend", "&emsp;");
                    break;
                case Space:
                    this._output.insertAdjacentHTML("beforeend", "&nbsp;");
                    break;
                case Backspace:
                    this._output.dispatchEvent(new InputEvent("beforeinput", {
                        inputType: "deleteContentBackward"
                    }));
                    break;
                default:
                    if (!validateCharacter(message.character)) {
                        console.debug(`Unknown character: ${message.character.toString(2).padStart(6, "0")}`)
                    } else {
                        this._output.insertAdjacentHTML("beforeend", this._case === Case.UpperCase
                            ? SixBitCharactersUppercaseReverse[message.character]!
                            : SixBitCharactersLowercaseReverse[message.character]!);
                    }
                    break;
            }
        }

        this._updateLights();
    }

    private _updateLights() {
        if (this._state === State.Green) {
            this._statusLights.children[0]!.textContent = "On";
            this._statusLights.children[1]!.textContent = "Off";
            this._input.disabled = false;
        } else {
            this._statusLights.children[0]!.textContent = "Off";
            this._statusLights.children[1]!.textContent = "On";
            this._input.disabled = true;
        }
    }

    private _onInput(event: InputEvent) {
        //TODO- limit line length
        if (!event.data) {
            if (event.inputType === "deleteContentBackward") {
                this._sendCharacter(Backspace);
            }
        } else {
            let character = SixBitCharactersLowercase[event.data]
            if (character !== undefined) {
                this._sendCharacter(character);
                return;
            }
            character = SixBitCharactersUppercase[event.data];

            if (character === undefined) {
                event.preventDefault();
            } else {
                this._sendCharacter(character | 0b1_000_000)
            }
        }
    }

    private _onKeyUp(event: KeyboardEvent) {
        if (event.key !== "Enter") {
            return;
        }
        this._state = State.Red;
        const message: TTypewriterMessage = {
            command: WorkerCommand.JOSSTypewriterMessage,
            station: this._stationNumber,
            carriageReturn: true,
        };
        this._typewriterWorker.port.postMessage(message);
        const value = this._input.value;
        this._input.value = "";
        this._output.insertAdjacentHTML("beforeend", value);
        this._updateLights();
    }
}

enum State {
    Red,
    Green,
}

enum RibbonColor {
    Black,
    Green,
}

enum Case {
    LowerCase,
    UpperCase,
}

interface IMTCMessage {
    enable?: true;
    disable?: true;
    character?: number;
    switchToUser?: true;
}