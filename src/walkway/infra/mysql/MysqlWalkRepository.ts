import _ from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";

import { Walk } from '../../domain/Walk/Walk';
import { WalkEntity } from '../../entity/Walk.entity';
import { IWalkRepository } from '../IWalkRepository';
import { MysqlWalkRepositoryMapper } from './mapper/MysqlWalkRepository.mapper';
import { WalkStatus } from '../../domain/Walk/WalkStatus';
import { WalkwayStatus } from '../../domain/Walkway/WalkwayStatus';
import { UserStatus } from '../../../user/domain/User/UserStatus';
import { User } from '../../../user/domain/User/User';
import { WALK_FINISH_STATUS } from '../../domain/Walk/WalkFinishStatus';
import { PaginationResult } from "../../../common/pagination/PaginationResponse";

export interface GetAllWalkOptions {
    user: User;
    finishStatus: WALK_FINISH_STATUS;
    paginationOptions?: IPaginationOptions;
}

export class MysqlWalkRepository implements IWalkRepository {
    constructor(
        @InjectRepository(WalkEntity)
        private readonly walkRepository: Repository<WalkEntity>,
    ) {}

    async paginate(options: IPaginationOptions): Promise<Pagination<WalkEntity>> {
        return paginate<WalkEntity>(this.walkRepository, options);
    }

    async getAll(options: GetAllWalkOptions): Promise<PaginationResult<Walk>> {
        const user = options.user;
        const finishStatus = options.finishStatus;
        const paginationOptions = options.paginationOptions;

        const query = this.walkRepository
        .createQueryBuilder('walk')
        .leftJoinAndSelect('walk.walkway', 'walkway')
        .leftJoinAndSelect('walkway.user', 'user_walkway')
        .leftJoinAndSelect('walk.user', 'user')
        .where('user.id = :userId', { userId: user.id })
        .andWhere('walk.status = :normal', { normal: WalkStatus.NORMAL })
        .andWhere('(walkway.status = :normal or walkway.status = :private)', {
            normal: WalkwayStatus.NORMAL,
            private: WalkwayStatus.PRIVATE,
        })
        .andWhere('user.status = :normal', { normal: UserStatus.NORMAL });
        
        if (finishStatus) {
            query.andWhere('walk.finishStatus = :finished', { finished: finishStatus});
        }
        
        query.orderBy('walk.createdAt', 'DESC');

        if (paginationOptions) {
            const walks = await paginate(query, paginationOptions);

            return {
                items: MysqlWalkRepositoryMapper.toDomains(walks.items),
                meta: walks.meta,
                links: walks.links,
            };
        }

        const walks = await query.getMany();

        return {
            items: MysqlWalkRepositoryMapper.toDomains(walks),
        }
    }

    async getOne(id: string) {
        const walk = await this.walkRepository.findOne({
            where : {
                id,
                status: WalkStatus.NORMAL,
                user: {
                    status: UserStatus.NORMAL,
                }
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
