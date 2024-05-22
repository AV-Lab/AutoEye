import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import { I18nService } from 'nestjs-i18n';
import { FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const salt = await bcrypt.genSalt(12);
    createUserInput.password = await bcrypt.hash(
      createUserInput.password.toString(),
      salt,
    );
    const user = this.usersRepository.create(createUserInput);
    return await this.usersRepository.save(user);
  }

  async findAll() {
    return await this.usersRepository.find({
      where: { deletedAt: IsNull() },
    });
  }

  async findOne(id: String) {
    const user = await this.usersRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!user) throw new GraphQLError(this.i18n.t('validation.USER_NOT_FOUND'));

    return user;
  }

  async findOneBy(where: FindOptionsWhere<User>) {
    const user = await this.usersRepository.findOne({ where });
    return user;
  }

  async update(id: String, updateUserInput: UpdateUserInput) {
    const updateUser = await this.usersRepository.update(
      { id },
      updateUserInput,
    );

    if (updateUser.affected === 0) {
      //throw error
    }

    return await this.findOne(id);
  }

  async delete(id: String) {
    const deleteUser = await this.usersRepository.softDelete({ id });

    if (deleteUser.affected === 0) {
      //throw error
    }

    return id;
  }

  async keyExists(where: FindOptionsWhere<User>, errorKey: string) {
    const count = await this.usersRepository.count({ where });
    if (count > 0)
      throw new GraphQLError(
        this.i18n.t('validation.USER_EXISTS', { args: { field: errorKey } }),
      );
  }

  async saveTokens() {}
}
