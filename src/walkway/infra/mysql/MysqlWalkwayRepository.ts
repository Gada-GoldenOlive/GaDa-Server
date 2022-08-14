import { InjectRepository } from "@nestjs/typeorm";
import _ from "lodash";
import { Repository } from "typeorm";

import { Walkway } from "../../domain/Walkway/Walkway";
import { Point } from "../../domain/Walkway/WalkwayStartPoint";
import { WalkwayStatus } from "../../domain/Walkway/WalkwayStatus";
import { WalkwayEntity } from "../../entity/Walkway.entity";
import { IWalkwayRepository } from "../IWalkwayRepository";
import { MysqlWalkwayRepositoryMapper } from "./mapper/MysqlWalkwayRepository.mapper";

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

    async findAll(coordinates: Point): Promise<Walkway[]> {
        const foundWalkways = await this.walkwayRepository
            .createQueryBuilder('walkway')
            .leftJoinAndSelect('walkway.user', 'user')
            .setParameter('curPoint', MysqlWalkwayRepositoryMapper.pointToString(coordinates))
            .where(('st_distance_sphere_1(ST_GeomFromText(:curPoint, 4326), walkway.startPoint) <= 2000'))
            .andWhere('walkway.status = :normalStatus', { normalStatus: WalkwayStatus.NORMAL })
            .orderBy('st_distance_sphere_1(ST_GeomFromText(:curPoint, 4326), walkway.startPoint)')
            .getMany();

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
