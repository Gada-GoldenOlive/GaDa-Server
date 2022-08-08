import _ from 'lodash';

import { AggregateRoot } from '../../../common/domain/AggregateRoot';
import { PROPS_VALUES_ARE_REQUIRED } from '../../../common/domain/Image/Image';
import { Result } from '../../../common/presentationals/Result';
import { WalkwayAddress } from './WalkwayAddress';
import { WalkwayDistance } from './WalkwayDistance';
import { WalkwayPath } from './WalkwayPath';
import { WalkwayTime } from './WalkwayTime';
import { WalkwayTitle } from './WalkwayTitle';

export interface WalkwayNewProps {
    title: WalkwayTitle;
    address: WalkwayAddress;
    distance: WalkwayDistance;
    time: WalkwayTime;
    path: WalkwayPath;
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
        if (_.isNil(props.title) || _.isNil(props.address) || _.isNil(props.path) || _.isNil(props.distance) || _.isNil(props.time)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        return Result.ok(new Walkway({
            ...props,
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

    get createdAt(): Date {
        return this.props.createdAt;
    }
    
    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
