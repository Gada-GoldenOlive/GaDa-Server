import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pin } from '../../domain/Pin';
import { PinEntity } from '../../entity/Pin.entity';
import { IPinRepository } from '../IPinRepository';

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

    findAll(walkwayId: string): Promise<Pin[]> {
        throw new Error('Method not implemented.');
    }
}
