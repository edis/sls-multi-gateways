import {readFileSync} from "fs";
import path from "path";
import YAML from "yaml";
import {Service} from "./types/service";
import express from "express";
import {createProxyMiddleware} from "http-proxy-middleware";

// reads and parses config file
const readConfigFile = () => {
    const file = readFileSync(path.join(process.cwd(), 'sls-multi-gateways.yml'),  'utf8');
    return YAML.parse(file)
};

// runs each services
const runServices = (services: Service[], httpPort: number, prefixColors: string[]) => {
    const commands = [];

    for (let i = 0; i < services.length; i++) {
        const execCommand = `
            cd  ${process.cwd()}/${services[i].srvName};
            sls offline --stage dev --httpPort ${httpPort + i} --lambdaPort ${httpPort + i + 1000}
        `;

        commands.push({
            command: execCommand,
            name: services[i].srvName,
            prefixColor: i < prefixColors.length ? prefixColors[i]: 'gray'
        });
    }

    return commands
}

// proxy each service
const runProxy = (services: Service[], httpPort: number) => {
    const app = express();

    for (let i = 0; i < services.length; i++) {

        app.use(`/dev/${services[i].srvPath}/`, createProxyMiddleware({
            target: `http://localhost:${httpPort + i}/`,
            changeOrigin: true,
        }));
    }

    app.listen(3000);
}

export { readConfigFile, runServices, runProxy };