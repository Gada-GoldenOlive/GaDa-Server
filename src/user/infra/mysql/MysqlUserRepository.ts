import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/User';
import { UserStatus } from '../../domain/UserStatus';
import { UserEntity } from '../../entity/User.entity';
import { IUserRepository } from '../IUserRepository';
import { MysqlUserRepositoryMapper } from './mapper/MysqlUserRepositoryMapper';

export class MysqlUserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                id,
                status: UserStatus.NORMAL,
            }
        });

        return MysqlUserRepositoryMapper.toDomain(user);
    }

    save(user: User): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    
    findAll(): Promise<User[]> {
        throw new Error('Method not implemented.');
    }
}