let clockValue = 0;

const CLOCK_FREQUENCY = 1000 / 30; // ~30 HZ

let buffer: Uint16Array | undefined;

onmessage = event => {
    buffer = event.data;
}

function updateClock() {
    if (buffer) {
        Atomics.add(buffer, 0, 1);
    }
}

setInterval(updateClock, CLOCK_FREQUENCY);