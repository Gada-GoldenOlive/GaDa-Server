import _ from 'lodash';

import { AggregateRoot } from '../../../common/domain/AggregateRoot';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { Result } from '../../../common/presentationals/Result';
import { UserGoalDistance } from './UserGoalDistance';
import { UserGoalTime } from './UserGoalTime';
import { UserLoginId } from './UserLoginId';
import { UserName } from './UserName';
import { UserPassword } from './UserPassword';
import { UserRefreshToken } from './UserRefreshToken';
import { UserStatus, USER_STATUS } from './UserStatus';
import { UserTotalDistance } from './UserTotalDistance';
import { UserTotalTime } from './UserTotalTime';
import { UserWeekDistance } from './UserWeekDistance';
import { UserWeekTime } from './UserWeekTime';

export interface UserNewProps {
    loginId: UserLoginId;
    password: UserPassword;
    name: UserName;
    image?: ImageUrl;
    goalDistance?: UserGoalDistance;
    goalTime?: UserGoalTime;
    totalDistance?: UserTotalDistance;
    totalTime?: UserTotalTime;
    weekDistance?: UserWeekDistance;
    weekTime?: UserWeekTime;
    status?: USER_STATUS;
    refreshToken?: UserRefreshToken;
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
        if (_.isNil(props.name) || _.isNil(props.loginId) || _.isNil(props.password)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        // TODO: image url이 전달되지 않을 경우에 default를 뭐로 설정해줘야 하나?
        // NOTE: 목표 시간, 거리는 null 그대로 전달해줘서 null일 경우 설정한 목표 시간/거리가 없습니다. 이런 창 띄워주는 걸 생각했어요
        return Result.ok(new User({
            ...props,
            totalDistance: UserTotalDistance.create(initialNumber).value,
            totalTime: UserTotalTime.create(initialNumber).value,
            weekDistance: UserWeekDistance.create(initialNumber).value,
            weekTime: UserWeekTime.create(initialNumber).value,
            status: this.getUserStatusAndSetIfStatusIsUndefined(props),
            image: this.getUserImageAndSetIfImageIsUndefined(props),
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }

    static create(props: UserProps, id: string): Result<User> {
        return Result.ok(new User(props, id));
    }

    get loginId(): UserLoginId {
        return this.props.loginId;
    }

    get password(): UserPassword {
        return this.props.password;
    }

    get name(): UserName {
        return this.props.name;
    }

    get image(): ImageUrl {
        return this.props.image;
    }

    get goalDistance(): UserGoalDistance {
        return this.props.goalDistance;
    }

    get goalTime(): UserGoalTime {
        return this.props.goalTime;
    }
    
    get totalDistance(): UserTotalDistance {
        return this.props.totalDistance;
    }

    get totalTime(): UserTotalTime {
        return this.props.totalTime;
    }

    get weekDistance(): UserWeekDistance {
        return this.props.weekDistance;
    }

    get weekTime(): UserWeekTime {
        return this.props.weekTime;
    }

    get status(): USER_STATUS {
        return this.props.status;
    }

    get refreshToken(): UserRefreshToken {
        return this.props.refreshToken;
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

    private static getUserImageAndSetIfImageIsUndefined(props: UserNewProps) {
        let { image } = props;
        const DEFAULT_USER_IMAGE_URL = 'https://golden-olive-gada.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%EB%B3%B8%EC%9D%B4%EB%AF%B8%EC%A7%80/profile.png';

        if (_.isNil(props.image) || _.isEmpty(props.image)) {
            image = ImageUrl.create(DEFAULT_USER_IMAGE_URL).value;
        }
        
        return image;
    }
}
