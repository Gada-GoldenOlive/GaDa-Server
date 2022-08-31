import _ from 'lodash';

import { AggregateRoot } from '../../../common/domain/AggregateRoot';
import { PROPS_VALUES_ARE_REQUIRED } from '../../../common/domain/Image/Image';
import { Result } from '../../../common/presentationals/Result';
import { User } from '../../../user/domain/User/User';
import { WalkwayAddress } from './WalkwayAddress';
import { WalkwayDistance } from './WalkwayDistance';
import { WalkwayEndPoint } from './WalkwayEndPoint';
import { WalkwayPath } from './WalkwayPath';
import { WalkwayStartPoint } from './WalkwayStartPoint';
import { WalkwayStatus, WALKWAY_STATUS } from './WalkwayStatus';
import { WalkwayTime } from './WalkwayTime';
import { WalkwayTitle } from './WalkwayTitle';

export interface WalkwayNewProps {
    title: WalkwayTitle;
    address: WalkwayAddress;
    distance: WalkwayDistance;
    time: WalkwayTime;
    path: WalkwayPath;
    startPoint: WalkwayStartPoint;
    endPoint: WalkwayEndPoint;
    user: User;
    status?: WALKWAY_STATUS;
}

export interface WalkwayProps extends WalkwayNewProps {
    createdAt: Date;
    updatedAt: Date;
}

export class Walkway extends AggregateRoot<WalkwayProps> {
    private constructor(props: WalkwayProps, id?: string) {
        super(props, id);
    }

    static createNew(props: WalkwayNewProps): Result<Walkway> {
        if (_.isNil(props.title) || _.isNil(props.address) || _.isNil(props.path) || _.isNil(props.startPoint) 
            || _.isNil(props.endPoint) || _.isNil(props.distance) || _.isNil(props.time)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        return Result.ok(new Walkway({
            ...props,
            status: this.getWalkwayStatusAndSetIfStatusIsUndefined(props),
            createdAt: new Date(),
            updatedAt: new Date(),
        }))
    }

    static create(props: WalkwayProps, id: string): Result<Walkway> {
        return Result.ok(new Walkway(props, id));
    }

    get title(): WalkwayTitle {
        return this.props.title;
    }

    get address(): WalkwayAddress{
        return this.props.address;
    }
    
    get distance(): WalkwayDistance {
        return this.props.distance;
    }

    get time(): WalkwayTime {
        return this.props.time;
    }

    get path(): WalkwayPath {
        return this.props.path;
    }

    get startPoint(): WalkwayStartPoint {
        return this.props.startPoint;
    }

    get endPoint(): WalkwayEndPoint {
        return this.props.endPoint;
    }

    get status(): WALKWAY_STATUS {
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

    private static getWalkwayStatusAndSetIfStatusIsUndefined(props: WalkwayNewProps) {
        let { status } = props;
        if (_.isNil(props.status) || _.isEmpty(props.status)) {
            status = WalkwayStatus.NORMAL;
        }
        
        return status;
    }
}
