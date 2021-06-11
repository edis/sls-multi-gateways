#!/usr/bin/env node

import yargs from 'yargs';
import concurrently from 'concurrently';
import {readConfigFile, runProxy, runServices} from "./handler";

const args: any  = yargs.options({
    'port': { type: 'number', demandOption: true, alias: 'p', default: 4000 },
}).argv;

console.log(args.port);
const httpPort = args.port;

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