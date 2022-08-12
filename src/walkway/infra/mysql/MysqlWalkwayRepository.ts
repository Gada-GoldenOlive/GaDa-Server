import { InjectRepository } from "@nestjs/typeorm";
import _ from "lodash";
import { Repository } from "typeorm";

import { Walkway } from "../../domain/Walkway/Walkway";
import { WalkwayEntity } from "../../entity/Walkway.entity";
import { IWalkwayRepository } from "../IWalkwayRepository";
import { MysqlWalkwayRepositoryMapper } from "./mapper/MysqlWalkwayRepository.mapper";

export class MysqlWalkwayRepository implements IWalkwayRepository {
    constructor(
        @InjectRepository(WalkwayEntity)
        private readonly walkwayRepository: Repository<WalkwayEntity>,
    ) {}

    async findOne(id: string): Promise<Walkway> {
        const walkway = await this.walkwayRepository.findOne( { where : { id }} );

        return MysqlWalkwayRepositoryMapper.toDomain(walkway);
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

        let [query, parameter] = await this.walkwayRepository
            .createQueryBuilder()
            .insert()
            .into('walkway')
            .values(MysqlWalkwayRepositoryMapper.toEntities(walkways))
            .getQueryAndParameters();

        await this.walkwayRepository.query(query.replace(/GeomFromText/gi, 'ST_GeomFromText'), parameter);

        return true;
    }
}
