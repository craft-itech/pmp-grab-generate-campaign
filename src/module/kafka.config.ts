import { KafkaOptions, Transport } from '@nestjs/microservices';
const fs = require('fs')

export const kafkaConfig: KafkaOptions = {
    transport: Transport.KAFKA,
    options: {
        client: {
            brokers: process.env.kafka_server.split(/[\s,]+/g),
            ssl: {
                rejectUnauthorized: false,
                key: [fs.readFileSync(process.env.kafka_ssl_key)],  
                cert: [fs.readFileSync(process.env.kafka_ssl_cert)],
                ca: [fs.readFileSync(process.env.kafka_ssl_ca)],    
            }
        },
    },
};