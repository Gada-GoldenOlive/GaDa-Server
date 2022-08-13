import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../user/domain/User';
import { UserStatus } from '../../../user/domain/UserStatus';
import { Walkway } from '../../../walkway/domain/Walkway/Walkway';
import { WalkwayStatus } from '../../../walkway/domain/Walkway/WalkwayStatus';
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

    findOne(id: string): Promise<Pin> {
        throw new Error('Method not implemented.');
    }

    save(pin: Pin): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async findAll(options: GetAllPinOptions): Promise<Pin[]> {
        const walkway = options.walkway;
        const user = options.user;

        const query = this.pinRepository
        .createQueryBuilder('pin')
        .where('pin.status = :status', { status: PinStatus.NORMAL })
        .leftJoinAndSelect('pin.walkway', 'walkway')
        .leftJoinAndSelect('walkway.user', 'user_walkway')
        .leftJoinAndSelect('pin.user', 'user')
        .andWhere('walkway.status = :status', { status: WalkwayStatus.NORMAL })
        .andWhere('user.status = :status', { status: UserStatus.NORMAL });

        if (walkway) query.andWhere('walkway.id = :walkwayId', { walkwayId: walkway.id });
        if (user) query.andWhere('user.id = :userId', { userId: user.id });

        const pins = await query.getMany();

        return MysqlPinRepositoryMapper.toDomains(pins);
    }
}
