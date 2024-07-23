JOHNNIAC Emulation

This is an emulator for the JOHHNIAC computer. For more information on this project, see the write up on [Epigenetic's Lab](https://epigeneticslab.net)

# Setup
To install dependencies run `npm i`.

You will also want to install [Browsersync](https://browsersync.io/) to test functionality involving Web Workers.

# Running Unit Tests
To run unit tests use `npm test`.

# Running the Project
You can run the project by running `index.ts`. Currently this is a minimum test illustrating that the J136E loader is correctly running.

To run functionality using Web Workers, you will want to open index.html in Browsersync: `browser-sync start --config bs-config.cjs`.
This file just runs the index script from within a webpage.