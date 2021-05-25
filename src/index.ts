#!/usr/bin/env node

import concurrently from 'concurrently';

import {readConfigFile, runProxy, runServices} from "./handler";

const httpPort = 4000;

const prefixColors = [
    'blue', 'green', 'magenta', 'cyan', 'white', 'gray', 'yellow', 'red'
];

const services = readConfigFile();

const commands = runServices(services, httpPort, prefixColors);

concurrently(commands, {
   killOthers: ['failure', 'success']
}).then()


process.on('SIGINT', () => {
    console.log("")
    process.exit(1);
});

runProxy(services, httpPort);