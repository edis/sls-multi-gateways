# sls-multi-gateways
sls-multi-gateways is a tool that allows you to run multiple api gateways under one domain for local development purposes.

## Installation
sls-multi-gateways needs to be installed globally using the following command:
```bash
npm install -g sls-multi-gateways
```

## Usage
After installing sls-multi-gateways, cd into your project directory
```bash
cd [project-directory]
```

Create a sls-multi-gateways config file
```bash
touch sls-multi-gateways.yml
```

Inside your sls-multi-gateways config file add the services you would like to run
```bash
port: [port the proxy will run on]
services:
  - srvName: [name of the service]
    srvPath: [proxy path to the service]
    srvSource: [path to the serverless.yml file belong to that service]
  - srvName: [name of the service 2]
    srvPath: [proxy path to the service 2]
    srvSource: [path to the serverless.yml file belong to that service]
```

All srvPaths are mapped to ```localhost:[port]/dev/[srvPath]```

To run sls-multi-gateways, execute the following cmd in the directory with the config file

```bash
sls-multi-gateways
```

## TODO
- [ ] Allow stage arg to be passed in when running cli (default is dev)
