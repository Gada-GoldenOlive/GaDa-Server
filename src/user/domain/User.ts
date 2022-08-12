import _ from 'lodash';

import { AggregateRoot } from '../../common/domain/AggregateRoot';
import { ImageUrl } from '../../common/domain/Image/ImageUrl';
import { Result } from '../../common/presentationals/Result';
import { UserName } from './UserName';
import { UserStatus, USER_STATUS } from './UserStatus';
import { UserTotalDistance } from './UserTotalDistance';
import { UserTotalTime } from './UserTotalTime';

export interface UserNewProps {
    name: UserName;
    image?: ImageUrl;
    totalDistance?: UserTotalDistance;
    totalTime?: UserTotalTime;
    status?: USER_STATUS;
}

export interface UserProps extends UserNewProps {
    createdAt: Date;
    updatedAt: Date;
}

export const initialNumber = 0;

export const PROPS_VALUES_ARE_REQUIRED = 'Props values are required.';

export class User extends AggregateRoot<UserProps> {
    private constructor(props: UserProps, id?: string) {
        super(props, id);
    }

    static createNew(props: UserNewProps): Result<User> {
        if (_.isNil(props.name)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        // TODO: image url이 전달되지 않을 경우에 default를 뭐로 설정해줘야 하나?
        return Result.ok(new User({
            ...props,
            totalDistance: UserTotalDistance.create(initialNumber).value,
            totalTime: UserTotalTime.create(initialNumber).value,
            status: this.getUserStatusAndSetIfStatusIsUndefined(props),
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }

    static create(props: UserProps, id: string): Result<User> {
        return Result.ok(new User(props, id));
    }

    get name(): UserName {
        return this.props.name;
    }

    get image(): ImageUrl {
        return this.props.image;
    }
    
    get totalDistance(): UserTotalDistance {
        return this.props.totalDistance;
    }

    get totalTime(): UserTotalTime {
        return this.props.totalTime;
    }

    get status(): USER_STATUS {
        return this.props.status;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    private static getUserStatusAndSetIfStatusIsUndefined(props: UserNewProps) {
        let { status } = props;
        if (_.isNil(props.status) || _.isEmpty(props.status)) {
            status = UserStatus.NORMAL;
        }
        
        return status;
    }
}
