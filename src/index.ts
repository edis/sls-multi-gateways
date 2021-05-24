#!/usr/bin/env node

import path from 'path';
import YAML from 'yaml';
import express from 'express';
import { readFileSync } from 'fs';
import concurrently from 'concurrently';
import {createProxyMiddleware} from "http-proxy-middleware";

interface Service {
    srvName: string;
    srvSource: string;
    srvPath: string;
}

const readConfigFile = () => {
    const file = readFileSync(path.join(process.cwd(), 'sls-multi.yml'),  'utf8');
    return YAML.parse(file).services as [Service];
};

const services = readConfigFile();

const httpPort = 4000;

const prefixColors = [
    'blue', 'green', 'magenta', 'cyan', 'white', 'gray', 'yellow'
];

const runServices = () => {
    const commands = [];

    for (let i = 0; i < services.length; i++) {
        const execCommand = `cd  ${process.cwd()}/${services[i].srvName}; sls offline --stage dev --httpPort ${httpPort + i} --lambdaPort ${httpPort + i + 1000}`;

        commands.push({
            command: execCommand,
            name: services[i].srvName,
            prefixColor: prefixColors[i]
        });
    }

    return commands
}

const commands = runServices();

concurrently(commands, {
   killOthers: ['failure', 'success']
}).then()


const runProxy = () => {
   const app = express();

    for (let i = 0; i < services.length; i++) {

       app.use(`/${services[i].srvPath}`, createProxyMiddleware({
           target: `localhost:${httpPort + i}`,
           changeOrigin: true,
           // TODO: handle path rewrite config option
           // pathRewrite: {
               // [`^/${services[i].srvPath}`]: `/dev/${services[i].srvPath}`,
           // }
       }));
   }

   app.listen(3000);
}

process.on('SIGINT', () => {
    console.log("\n")
    process.exit(1);
});

runProxy();