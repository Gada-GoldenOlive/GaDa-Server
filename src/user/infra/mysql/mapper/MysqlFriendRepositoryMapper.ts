import _ from "lodash";

import { Friend } from "../../../domain/Friend/Friend";
import { FriendEntity } from "../../../entity/Friend.entity";
import { MysqlUserRepositoryMapper } from "./MysqlUserRepositoryMapper";

export class MysqlFriendRepositoryMapper {
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
