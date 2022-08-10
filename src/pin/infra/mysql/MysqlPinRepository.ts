import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pin } from '../../domain/Pin';
import { PinStatus } from '../../domain/PinStatus';
import { PinEntity } from '../../entity/Pin.entity';
import { IPinRepository } from '../IPinRepository';
import { MysqlPinRepositoryMapper } from './mapper/MysqlPinRepositoryMapper';

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

    async findAll(walkwayId: string): Promise<Pin[]> {
        const foundPins = await this.pinRepository.find({
            where: {
                status: PinStatus.NORMAL,
                walkway: {
                    id: walkwayId,
                },
            },
            relations: ['walkway'],
            order: {
                createdAt: 'DESC',
            },
        });

        return MysqlPinRepositoryMapper.toDomains(foundPins)
    }
}
