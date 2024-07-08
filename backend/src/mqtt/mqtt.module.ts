import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Server } from './entities/server.entity';
import { MqttService } from './mqtt.service';

@Module({
    imports: [TypeOrmModule.forFeature([Client, Server])],
    providers: [MqttService, JwtService],
})
export class MqttModule {}
