#!/usr/bin/env node

import concurrently from 'concurrently';
import {readConfigFile, runProxy, runServices} from "./handler";
import {Service} from "./types/service";


const prefixColors = [
    'blue', 'green', 'magenta', 'cyan', 'white', 'gray', 'yellow', 'red'
];

const file = readConfigFile()

const services = file.services as Service[];
const httpPort = file.port || 3000;

const commands = runServices(services, httpPort, prefixColors);

concurrently(commands, {
   killOthers: ['failure', 'success']
}).then()


process.on('SIGINT', () => {
    console.log("")
    process.exit(1);
});

runProxy(services, httpPort);