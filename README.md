# Simple crud apis written with Nest.js and Postgress Database


  

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Kafka run

### Start zookeeper

```bash
bin/zookeeper-server-start.sh config/zookeeper.properties
```

### Start Kafka

```bash
bin/kafka-server-start.sh config/server.properties
```
