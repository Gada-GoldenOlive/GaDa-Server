import _ from "lodash";

import { Friend } from "../../../domain/Friend/Friend";
import { FriendEntity } from "../../../entity/Friend.entity";
import { MysqlUserRepositoryMapper } from "./MysqlUserRepositoryMapper";

export class MysqlFriendRepositoryMapper {
    static toDomain(entity: FriendEntity): Friend {
        if (_.isNil(entity)) {
            return null;
        }

        const friend = Friend.create(
            {
                status: entity.status,
                user1: MysqlUserRepositoryMapper.toDomain(entity.user1),
                user2: MysqlUserRepositoryMapper.toDomain(entity.user2),
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
            },
            entity.id,
        ).value;

        return friend;
    }

    static toDomains(entities: FriendEntity[]): Friend[] {
        return _.map(entities, this.toDomain);
    }

    static toEntity(friend: Friend): FriendEntity {
        if (_.isNil(friend)) {
            return null;
        }

        const entity = new FriendEntity();
        entity.id = friend.id;
        entity.user1 = MysqlUserRepositoryMapper.toEntity(friend.user1);
        entity.user2 = MysqlUserRepositoryMapper.toEntity(friend.user2);
        entity.status = friend.status;
        entity.createdAt = friend.createdAt;
        entity.updatedAt = friend.updatedAt;

        return entity;
    }
}
