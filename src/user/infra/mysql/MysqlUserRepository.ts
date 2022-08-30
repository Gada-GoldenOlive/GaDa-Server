import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../domain/User/User';
import { UserStatus } from '../../domain/User/UserStatus';
import { UserEntity } from '../../entity/User.entity';
import { IUserRepository } from '../IUserRepository';
import { MysqlUserRepositoryMapper } from './mapper/MysqlUserRepositoryMapper';

export interface FindOneUserOptions {
    id?: string;
    userId?: string;
    password?: string;
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
        if (options.userId) query.andWhere('user.userId = :userId', { userId: options.userId });
        if (options.password) query.andWhere('user.password = :password', { password: options.password });

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
