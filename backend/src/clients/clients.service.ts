import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateClientInput } from './dto/create-client.input';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    private readonly i18n: I18nService,
  ) {}

  async create(createClientInput: CreateClientInput) {
    const client = this.clientsRepository.create(createClientInput);
    return await this.clientsRepository.save(client);
  }

  async findAll() {
    return await this.clientsRepository.find({
      where: { deletedAt: IsNull() },
    });
  }
}
