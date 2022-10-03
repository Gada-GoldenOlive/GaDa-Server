import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../domain/User/User';
import { UserStatus } from '../../domain/User/UserStatus';
import { UserEntity } from '../../entity/User.entity';
import { IUserRepository } from '../IUserRepository';
import { MysqlUserRepositoryMapper } from './mapper/MysqlUserRepositoryMapper';

export interface FindOneUserOptions {
    id?: string;
    loginId?: string;
    password?: string;
    name?: string;
}

export class MysqlUserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async findOne(options: FindOneUserOptions): Promise<User> {
        const query = this.userRepository
        .createQueryBuilder('user')
        .where('user.status = :normal', { normal: UserStatus.NORMAL })

        if (options.id) query.andWhere('user.id = :id', { id: options.id });
        if (options.loginId) query.andWhere('user.loginId = :loginId', { loginId: options.loginId });
        if (options.password) query.andWhere('user.password = :password', { password: options.password });
        if (options.name) query.andWhere('user.name = :name', { name: options.name });

        const user = await query.getOne();

        return MysqlUserRepositoryMapper.toDomain(user);
    }

    async save(user: User): Promise<boolean> {
        await this.userRepository.save(
            MysqlUserRepositoryMapper.toEntity(user),
        );

        return true;
    }
    
    findAll(): Promise<User[]> {
        throw new Error('Method not implemented.');
    }
}
