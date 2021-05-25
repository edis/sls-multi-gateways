import {readFileSync} from "fs";
import path from "path";
import YAML from "yaml";
import {Service} from "./service";
import express from "express";
import {createProxyMiddleware} from "http-proxy-middleware";

const readConfigFile = () => {
    const file = readFileSync(path.join(process.cwd(), 'sls-multi.yml'),  'utf8');
    return YAML.parse(file).services as Service[];
};

const runServices = (services: Service[], httpPort: number, prefixColors: string[]) => {
    const commands = [];

    for (let i = 0; i < services.length; i++) {
        // const execCommand = `cd  ${process.cwd()}/${services[i].srvName}; sls offline --stage dev --httpPort ${httpPort + i} --lambdaPort ${httpPort + i + 1000}`;
        // cd  ../techtimes-api/${services[i].srvName};
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