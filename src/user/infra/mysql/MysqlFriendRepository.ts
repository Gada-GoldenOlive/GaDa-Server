import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Friend } from '../../domain/Friend/Friend';
import { FriendEntity } from '../../entity/Friend.entity';
import { IFriendRepository } from '../IFriendRepository';
import { MysqlFriendRepositoryMapper } from './mapper/MysqlFriendRepositoryMapper';

export class MysqlFriendRepository implements IFriendRepository {
    constructor(
        @InjectRepository(FriendEntity)
        private readonly userRepository: Repository<FriendEntity>,
    ) {}

    async save(friend: Friend): Promise<boolean> {
        await this.userRepository.save(
            MysqlFriendRepositoryMapper.toEntity(friend),
        );

        return true;
    }
}
