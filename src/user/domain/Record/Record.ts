import _ from 'lodash';

import { AggregateRoot } from '../../../common/domain/AggregateRoot';
import { Result } from '../../../common/presentationals/Result';
import { User } from '../User/User';
import { RecordStatus, RECORD_STATUS } from './RecordStatus';


export interface RecordNewProps {
    status?: RECORD_STATUS;
    user: User;
}

export interface RecordProps extends RecordNewProps {
    createdAt: Date;
    updatedAt: Date;
}

export const PROPS_VALUES_ARE_REQUIRED = 'Props values are required.';

export class Record extends AggregateRoot<RecordProps> {
    private constructor(props: RecordProps, id?: string) {
        super(props, id);
    }

    static createNew(props: RecordNewProps): Result<Record> {
        if (_.isNil(props.user)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        return Result.ok(new Record({
            ...props,
            status: this.getRecordStatusAndSetIfStatusIsUndefined(props),
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }

    static create(props: RecordProps, id: string): Result<Record> {
        return Result.ok(new Record(props, id));
    }

    get status(): RECORD_STATUS {
        return this.props.status;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    get user(): User {
        return this.props.user;
    }

    private static getRecordStatusAndSetIfStatusIsUndefined(props: RecordNewProps) {
        let { status } = props;
        if (_.isNil(props.status) || _.isEmpty(props.status)) {
            status = RecordStatus.NORMAL;
        }

        return status;
    }
}
