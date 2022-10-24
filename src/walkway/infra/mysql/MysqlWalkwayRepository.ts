import _ from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import {Brackets, Repository} from 'typeorm';

import { Walkway } from '../../domain/Walkway/Walkway';
import { Point } from '../../domain/Walkway/WalkwayStartPoint';
import { WalkwayStatus } from '../../domain/Walkway/WalkwayStatus';
import { WalkwayEntity } from '../../entity/Walkway.entity';
import { IWalkwayRepository } from '../IWalkwayRepository';
import { MysqlWalkwayRepositoryMapper } from './mapper/MysqlWalkwayRepository.mapper';
import {query} from "express";

export class MysqlWalkwayRepository implements IWalkwayRepository {
    constructor(
        @InjectRepository(WalkwayEntity)
        private readonly walkwayRepository: Repository<WalkwayEntity>,
    ) {}

    async findOne(id: string): Promise<Walkway> {
        const walkway = await this.walkwayRepository.findOne({
             where : { id },
             relations: ['user'],
        });

        return MysqlWalkwayRepositoryMapper.toDomain(walkway);
    }

    async findAll(coordinates: Point, userId: string): Promise<Walkway[]> {
        const query = await this.walkwayRepository
        .createQueryBuilder('walkway')
        .leftJoinAndSelect('walkway.user', 'user');

        if (coordinates) {
            query.setParameter('curPoint', MysqlWalkwayRepositoryMapper.pointToString(coordinates))
            .where('(st_distance_sphere_1(ST_GeomFromText(:curPoint, 4326), walkway.startPoint) <= 1200 or st_distance_sphere_1(ST_GeomFromText(:curPoint, 4326), walkway.endPoint) <= 1200)')
            .andWhere(new Brackets(query => {
                query.where('walkway.status = :normalStatus', { normalStatus: WalkwayStatus.NORMAL })
                .orWhere('(walkway.status = :privateStatus and user.id = :userId)', {
                    privateStatus: WalkwayStatus.PRIVATE,
                    userId: userId,
                })
            }))
            .orderBy('LEAST(st_distance_sphere_1(ST_GeomFromText(:curPoint, 4326), walkway.startPoint), st_distance_sphere_1(ST_GeomFromText(:curPoint, 4326), walkway.endPoint))')
            .limit(10)
        }
        else {
            query.where('(walkway.status = :privateStatus or walkway.status = :normalStatus)', {
                normalStatus: WalkwayStatus.NORMAL,
                privateStatus: WalkwayStatus.PRIVATE,
            })
            .andWhere('user.id = :userId', { userId: userId })
            .orderBy('walkway.createdAt', 'DESC');
        }

        const foundWalkways = await query.getMany();

        return MysqlWalkwayRepositoryMapper.toDomains(foundWalkways);
    }

    async save(walkway: Walkway): Promise<boolean> {
        await this.walkwayRepository.save(
            MysqlWalkwayRepositoryMapper.toEntity(walkway)
        );

        return true;
    }

    async saveAll(walkways: Walkway[]): Promise<boolean> {
        if (_.isEmpty(walkways))
            return false;

        await this.walkwayRepository
            .createQueryBuilder()
            .insert()
            .into('walkway')
            .values(MysqlWalkwayRepositoryMapper.toEntities(walkways))
            .execute();

        return true;
    }
}
