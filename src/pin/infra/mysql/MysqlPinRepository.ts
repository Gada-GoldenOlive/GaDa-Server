import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../user/domain/User';
import { UserStatus } from '../../../user/domain/UserStatus';
import { Walkway } from '../../../walkway/domain/Walkway/Walkway';
import { WalkwayStatus } from '../../../walkway/domain/Walkway/WalkwayStatus';
import { MysqlWalkwayRepositoryMapper } from '../../../walkway/infra/mysql/mapper/MysqlWalkwayRepository.mapper';
import { Pin } from '../../domain/Pin';
import { PinStatus } from '../../domain/PinStatus';
import { PinEntity } from '../../entity/Pin.entity';
import { IPinRepository } from '../IPinRepository';
import { MysqlPinRepositoryMapper } from './mapper/MysqlPinRepositoryMapper';

export interface GetAllPinOptions {
    walkway?: Walkway;
    user?: User;
}

export class MysqlPinRepository implements IPinRepository {
    constructor(
        @InjectRepository(PinEntity)
        private readonly pinRepository: Repository<PinEntity>,
    ) {}

    async findOne(id: string): Promise<Pin> {
        const pin = await this.pinRepository.findOne({
            where: {
                id,
                status: PinStatus.NORMAL,
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

        return MysqlPinRepositoryMapper.toDomain(pin);
    }

    async save(pin: Pin): Promise<boolean> {
        await this.pinRepository.save(
            MysqlPinRepositoryMapper.toEntity(pin),
        );

        return true;
    }

    async findAll(options: GetAllPinOptions): Promise<Pin[]> {
        const walkway = options.walkway;
        const user = options.user;

        const query = this.pinRepository
        .createQueryBuilder('pin')
        .leftJoinAndSelect('pin.walkway', 'walkway')
        .leftJoinAndSelect('walkway.user', 'user_walkway')
        .leftJoinAndSelect('pin.user', 'user')
        .where('pin.status = :normal', { normal: PinStatus.NORMAL })
        .andWhere('walkway.status = :normal', { normal: WalkwayStatus.NORMAL })
        .andWhere('user.status = :normal', { normal: UserStatus.NORMAL });

        if (walkway) {
            query.andWhere('walkway.id = :walkwayId', { walkwayId: walkway.id })
            .setParameter('standardPoint', MysqlWalkwayRepositoryMapper.pointToString(walkway.startPoint.value))
            .orderBy(('st_distance_sphere_1(ST_GeomFromText(:standardPoint, 4326), pin.location)'));
        }

        if (user) {
            query.andWhere('user.id = :userId', { userId: user.id })
            .orderBy('pin.createdAt', 'DESC');
        }
        
        const pins = await query.getMany();

        return MysqlPinRepositoryMapper.toDomains(pins);
    }
}
