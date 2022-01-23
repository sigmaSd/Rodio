# Rodio
Simple radio interface using html typescript css

## Dependencies
Requires `npm` and `npx`

Requires `swc` to transpile typescript to javascript

`chokidar` is used for watching the project and triggering rebuilds

*Steps*:
- npm i -D @swc/cli @swc/core
- npm i -D chokidar

## Running
*Start the compiler*: 
- npx swc -w index.ts -o index.js

*Start the application*:
- firefox index.html



