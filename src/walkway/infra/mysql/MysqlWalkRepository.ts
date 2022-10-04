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
import { GET_ALL_WALK_OPTION, IGetAllWalkUseCaseRequest } from '../../application/GetAllWalkUseCase/dto/GetAllWalkUseCaseRequest';

export class MysqlWalkRepository implements IWalkRepository {
    constructor(
        @InjectRepository(WalkEntity)
        private readonly walkRepository: Repository<WalkEntity>,
    ) {}

    async findAll(request: IGetAllWalkUseCaseRequest): Promise<Walk[]> {
        let userId = request.userId;
        let option = request.option;

        const query = this.walkRepository
        .createQueryBuilder('walk')
        .leftJoinAndSelect('walk.walkway', 'walkway')
        .leftJoinAndSelect('walkway.user', 'user_walkway')
        .leftJoinAndSelect('walk.user', 'user')
        .leftJoinAndSelect('walk.review', 'review')
        .where('user.id = :userId', { userId: userId })
        .andWhere('walk.status = :normal', { normal: WalkStatus.NORMAL })
        .andWhere('walkway.status = :normal', { normal: WalkwayStatus.NORMAL })
        .andWhere('user.status = :normal', { normal: UserStatus.NORMAL })
        .orderBy('walk.createdAt', 'DESC')

        if (option == GET_ALL_WALK_OPTION.USER_INFO)
            query.andWhere('walk.reviewId IS NULL')

        const walks = await query.getMany();

        return MysqlWalkRepositoryMapper.toDomains(walks);
    }

    async findOne(id: string) {
        const walk = await this.walkRepository.findOne({
            where : {
                id,
                status: WalkStatus.NORMAL,
                user: {
                    status: UserStatus.NORMAL,
                },
                walkway: {
                    status: WalkwayStatus.NORMAL,
                },
            },
            relations: [
                'user',
                'walkway',
            ],
       });

       return MysqlWalkRepositoryMapper.toDomain(walk);
    }

    async save(walk: Walk): Promise<boolean> {
        await this.walkRepository.save(
            MysqlWalkRepositoryMapper.toEntity(walk)
        );

        return true;
    }
}
