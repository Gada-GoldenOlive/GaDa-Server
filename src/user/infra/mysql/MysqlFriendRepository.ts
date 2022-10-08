import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Friend } from '../../domain/Friend/Friend';
import { UserStatus } from '../../domain/User/UserStatus';
import { FriendEntity } from '../../entity/Friend.entity';
import { IFriendRepository } from '../IFriendRepository';
import { MysqlFriendRepositoryMapper } from './mapper/MysqlFriendRepositoryMapper';

export class MysqlFriendRepository implements IFriendRepository {
    constructor(
        @InjectRepository(FriendEntity)
        private readonly friendRepository: Repository<FriendEntity>,
    ) {}

    async findOne(id: string): Promise<Friend> {
        const friend = await this.friendRepository.findOne({
            where : {
                id,
                user1: {
                    status: UserStatus.NORMAL,
                },
                user2: {
                    status: UserStatus.NORMAL,
                },
            },
            relations: [
                'user1',
                'user2',
            ],
       });

       return MysqlFriendRepositoryMapper.toDomain(friend);
    }

    async save(friend: Friend): Promise<boolean> {
        await this.friendRepository.save(
            MysqlFriendRepositoryMapper.toEntity(friend),
        );

        return true;
    }
}
