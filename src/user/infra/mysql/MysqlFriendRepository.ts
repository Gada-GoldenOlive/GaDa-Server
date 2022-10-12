import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { Friend } from '../../domain/Friend/Friend';
import { FriendStatus } from '../../domain/Friend/FriendStatus';
import { UserStatus } from '../../domain/User/UserStatus';
import { FriendEntity } from '../../entity/Friend.entity';
import { IFriendRepository } from '../IFriendRepository';
import { MysqlFriendRepositoryMapper } from './mapper/MysqlFriendRepositoryMapper';

export interface FindAllFriendOptions {
    userId: string;
    isRank: boolean;
}

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

    async findAll(options: FindAllFriendOptions): Promise<Friend[]> {
        const userId = options.userId;
        const isRank = options.isRank;

        const query = this.friendRepository
        .createQueryBuilder('friend')
        .leftJoinAndSelect('friend.user1', 'user1')
        .leftJoinAndSelect('friend.user2', 'user2')
        .where('user1.status = :normal', { normal: UserStatus.NORMAL })
        .andWhere('user2.status = :normal', { normal: UserStatus.NORMAL });

        if (isRank) {
            query.andWhere(new Brackets(query => {
                query.where('user1.id = :userId', { userId })
                .orWhere('user2.id = :userId', {userId})
            }))
            .andWhere(new Brackets(query => {
                query.where('friend.status = :requested', { requested: FriendStatus.REQUESTED })
                .orWhere('friend.status = :accepted', { accepted: FriendStatus.ACCEPTED })
                .orWhere('friend.status = :read', { read: FriendStatus.READ });
            }));
        }

        else {
            query.andWhere('user2.id = :userId', { userId })
            .andWhere(new Brackets(query => {
                query.where('friend.status = :requested', { requested: FriendStatus.REQUESTED })
                .orWhere('friend.status = :read', { read: FriendStatus.READ })
            }))
            .orderBy('friend.createdAt', 'DESC');
        }

        const friends = await query.getMany();

        return MysqlFriendRepositoryMapper.toDomains(friends);
    }

    async save(friend: Friend): Promise<boolean> {
        await this.friendRepository.save(
            MysqlFriendRepositoryMapper.toEntity(friend),
        );

        return true;
    }
}
