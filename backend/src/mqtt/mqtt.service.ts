import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Aedes from 'aedes';
import { createServer } from 'aedes-server-factory';
import { JwtPayload } from 'src/auth/types/jwt.payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MqttService implements OnModuleInit {
    private readonly logger = new Logger(MqttService.name);

  onModuleInit() {
    this.initServer();
  }

  constructor(private readonly jwtService: JwtService) {}

  async initServer() {
    const mqttPort = 1883;
    const wsPort = 8888;
    const aedes = new Aedes();

    const mqttServer = createServer(aedes);
    const wsServer = createServer(aedes, { ws: true });

    aedes.authenticate = (client, username, password, callback) => {
      if (!username || !password) {
        // add i18n
        callback({ ...new Error('Auth error'), ...{ returnCode: 4 }}, null);
      } else {
        // Check if vehicle, or web client
        const vehiclePrefix = 'AE' + '_';
        if (client.id.startsWith(vehiclePrefix)) {
          const clientId = client.id.replace(vehiclePrefix, '');
          
          // check in database for client id
          // if not found, fail, if found check which vehicle
          // authorize publish to only /vehicles/id/#

          console.log('Client vehicle connected');

          callback(null, true);
        } else {
          // // 1. Decode JWT
          // const jwt: JwtPayload = this.jwtService.decode(username);
          // // 2. Check if authenticated
          // // 3. Add mqtt client id to mtm db table
          // console.log(jwt.username);

          console.log('Client connected');
        }
      }
    };

    // authorize subscribe
    // 1. get client id
    // 2. check role of user from client id
    // 3. allow to following topics

    mqttServer.listen(mqttPort, () => {
      this.logger.log(`MQTT service started and listening on port ${mqttPort}`);
    });

    wsServer.listen(wsPort, () => {
      this.logger.log(`MQTTOWS service started and listening on port ${wsPort}`);
    });
  }
}
