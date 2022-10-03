import _ from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Walk } from '../../domain/Walk/Walk';
import { WalkEntity } from '../../entity/Walk.entity';
import { IWalkRepository } from '../IWalkRepository';
import { MysqlWalkRepositoryMapper } from './mapper/MysqlWalkRepository.mapper';
import { WalkStatus } from '../../domain/Walk/WalkStatus';
import { WalkwayStatus } from '../../domain/Walkway/WalkwayStatus';
import { UserStatus } from '../../../user/domain/User/UserStatus';
import { User } from '../../../user/domain/User/User';

export class MysqlWalkRepository implements IWalkRepository {
    constructor(
        @InjectRepository(WalkEntity)
        private readonly walkRepository: Repository<WalkEntity>,
    ) {}

    async findAll(user: User): Promise<Walk[]> {
        const query = this.walkRepository
        .createQueryBuilder('walk')
        .leftJoinAndSelect('walk.walkway', 'walkway')
        .leftJoinAndSelect('walkway.user', 'user_walkway')
        .leftJoinAndSelect('walk.user', 'user')
        .where('user.id = :userId', { userId: user.id })
        .andWhere('walk.status = :normal', { normal: WalkStatus.NORMAL })
        .andWhere('walkway.status = :normal', { normal: WalkwayStatus.NORMAL })
        .andWhere('user.status = :normal', { normal: UserStatus.NORMAL })
        .orderBy('walk.createdAt', 'DESC');

        const walks = await query.getMany();

        return MysqlWalkRepositoryMapper.toDomains(walks);
    }

    async save(walk: Walk): Promise<boolean> {
        await this.walkRepository.save(
            MysqlWalkRepositoryMapper.toEntity(walk)
        );

        return true;
    }
}
