import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { Friend } from '../../domain/Friend/Friend';
import { FriendStatus } from '../../domain/Friend/FriendStatus';
import { UserStatus } from '../../domain/User/UserStatus';
import { FriendEntity } from '../../entity/Friend.entity';
import { IFriendRepository } from '../IFriendRepository';
import { MysqlFriendRepositoryMapper } from './mapper/MysqlFriendRepositoryMapper';
import {User} from "../../domain/User/User";

export interface FindAllFriendOptions {
    userId: string;
    isRank: boolean;
}

export interface FindOneFriendOptions {
    user1?: User;
    user2?: User;
    id?: string;
}

export class MysqlFriendRepository implements IFriendRepository {
    constructor(
        @InjectRepository(FriendEntity)
        private readonly friendRepository: Repository<FriendEntity>,
    ) {}

    async findOne(options: FindOneFriendOptions): Promise<Friend> {
        const id = options.id;
        const user1 = options.user1;
        const user2 = options.user2;

        const query = this.friendRepository
        .createQueryBuilder('friend')
        .leftJoinAndSelect('friend.user1', 'user1')
        .leftJoinAndSelect('friend.user2', 'user2')
        .where('user1.status = :normal', { normal: UserStatus.NORMAL })
        .andWhere('user2.status = :normal', { normal: UserStatus.NORMAL });

        if (id) {
            query.andWhere('friend.id = :friendId', { friendId: id });
        }

        else {
            query.andWhere('user1.id = :user1Id', { user1Id: user1.id })
            .andWhere('user2.id = :user2Id', { user2Id: user2.id });
        }

        const friend = await query.getOne();

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
