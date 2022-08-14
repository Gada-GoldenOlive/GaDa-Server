import { InjectRepository } from "@nestjs/typeorm";
import _ from "lodash";
import { Repository } from "typeorm";

import { Walk } from "../../domain/Walk/Walk";
import { WalkEntity } from "../../entity/Walk.entity";
import { IWalkRepository } from "../IWalkRepository";
import { MysqlWalkRepositoryMapper } from "./mapper/MysqlWalkRepository.mapper";

export class MysqlWalkRepository implements IWalkRepository {
    constructor(
        @InjectRepository(WalkEntity)
        private readonly walkRepository: Repository<WalkEntity>,
    ) {}

    async save(walk: Walk): Promise<boolean> {
        await this.walkRepository.save(
            MysqlWalkRepositoryMapper.toEntity(walk)
        );

        return true;
    }
}
