import _ from 'lodash';

import { AggregateRoot } from '../../common/domain/AggregateRoot';
import { ImageUrl } from '../../common/domain/Image/ImageUrl';
import { Result } from '../../common/presentationals/Result';
import { UserName } from './UserName';
import { UserPinCount } from './UserPinCount';
import { UserTotalDistance } from './UserTotalDistance';
import { UserTotalTime } from './UserTotalTime';

export interface UserNewProps {
    name: UserName;
    image?: ImageUrl;
    pinCount?: UserPinCount;
    totalDistance?: UserTotalDistance;
    totalTime?: UserTotalTime;
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
            pinCount: UserPinCount.create(initialNumber).value,
            totalDistance: UserTotalDistance.create(initialNumber).value,
            totalTime: UserTotalTime.create(initialNumber).value,
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

    get pinCount(): UserPinCount {
        return this.props.pinCount;
    }

    get totalDistance(): UserTotalDistance {
        return this.props.totalDistance;
    }

    get totalTime(): UserTotalTime {
        return this.props.totalTime;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
