import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Injectable()
export class MqttService implements OnModuleInit {
  onModuleInit() {
    // console.log('MQTT Service Started');
    // this.handleClients();
  }

  constructor(private readonly clientsService: ClientsService) {}

  async handleClients() {
    await this.clientsService.findAll().then((clients) => {
      clients.forEach((client) => {
        const connOps = JSON.parse(JSON.stringify(client.connectionOptions));
        const mqtt = require('mqtt');
        const mqttClient = mqtt.connect(connOps.host);

        mqttClient.on('connect', () => {
          console.log('Connected to MQTT Broker: ' + client.name);
          mqttClient.subscribe('presence', (err: any) => {
            if (!err) {
              mqttClient.publish('presence', 'Hello mqtt');
            }
          });
        });

        mqttClient.on('message', (topic: any, message: any) => {
          // message is Buffer
          console.log(message.toString());
        });

        mqttClient.on('error', (error: any) => {
          if (error.code == 'ENOTFOUND')
            console.log(
              'Unable to connect to ' +
                connOps.host +
                ' (not found)... Retrying.',
            );
        });
      });
    });
  }
}
