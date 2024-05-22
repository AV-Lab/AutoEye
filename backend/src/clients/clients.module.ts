import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsResolver } from './clients.resolver';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { MqttService } from './mqtt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientsResolver, ClientsService, MqttService],
  exports: [ClientsService],
})
export class ClientsModule {}
