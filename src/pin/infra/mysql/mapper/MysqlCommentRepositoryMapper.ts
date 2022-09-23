import _ from 'lodash';
import { MysqlUserRepositoryMapper } from '../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper';

import { Comment } from '../../../domain/Comment/Comment';
import { CommentEntity } from '../../../entity/Comment.entity';
import { MysqlPinRepositoryMapper } from './MysqlPinRepositoryMapper';

export class MysqlCommentRepositoryMapper {
    static toEntity(comment: Comment): CommentEntity {
        if (_.isNil(comment)) {
            return null;
        }

        const entity = new CommentEntity();
        entity.id = comment.id;
        entity.content = comment.content.value;
        entity.pin = MysqlPinRepositoryMapper.toEntity(comment.pin);
        entity.user = MysqlUserRepositoryMapper.toEntity(comment.user);
        entity.status = comment.status;
        entity.createdAt = comment.createdAt;
        entity.updatedAt = comment.updatedAt;

        return entity;
    }
}
