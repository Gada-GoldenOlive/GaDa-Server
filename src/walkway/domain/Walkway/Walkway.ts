import _ from 'lodash';

import { AggregateRoot } from '../../../common/domain/AggregateRoot';
import { PROPS_VALUES_ARE_REQUIRED } from '../../../common/domain/Image/Image';
import { Result } from '../../../common/presentationals/Result';
import { WalkwayAddress } from './WalkwayAddress';
import { WalkwayCreator } from './WalkwayCreator';
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
    creator: WalkwayCreator;
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
        if (_.isNil(props.title) || _.isEmpty(props.title)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        if (_.isNil(props.address) || _.isEmpty(props.address)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        if (_.isNil(props.creator) || _.isEmpty(props.creator)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        if (_.isNil(props.path) || _.isEmpty(props.path)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        if (_.isNil(props.distance)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        if (_.isNil(props.time)) {
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

    get creator(): WalkwayCreator {
        return this.props.creator;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
    
    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}