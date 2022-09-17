import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { CoreEntity } from '../../common/entity/Core.entity';
import { UserEntity } from './User.entity';
import { RecordStatus, RECORD_STATUS } from '../domain/Record/RecordStatus';

@Entity('record')
export class RecordEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'enum',
        enum: RecordStatus,
        default: RecordStatus.NORMAL,
    })
    @Index()
    status: RECORD_STATUS;

    @Column({
        nullable: false,
        type: 'float',
    })
    distance: number;

    @Column({
        nullable: false,
        type: 'int',
    })
    time: number;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.records, { nullable: false })
    user: UserEntity;
}
