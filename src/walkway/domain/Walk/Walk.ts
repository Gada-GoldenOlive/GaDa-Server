import _ from "lodash";

import { AggregateRoot } from "../../../common/domain/AggregateRoot";
import { PROPS_VALUES_ARE_REQUIRED } from "../../../common/domain/Image/Image";
import { Result } from "../../../common/presentationals/Result";
import { User } from "../../../user/domain/User/User";
import { Walkway } from "../Walkway/Walkway";
import { WalkDistance } from "./WalkDistance";
import { WALK_FINISH_STATUS } from "./WalkFinishStatus";
import { WalkStatus, WALK_STATUS } from "./WalkStatus";
import { WalkTime } from "./WalkTime";

export interface WalkNewProps {
    time: WalkTime,
    distance: WalkDistance,
    finishStatus: WALK_FINISH_STATUS,
    walkway: Walkway;
    user: User;
    status?: WALK_STATUS;
}

export interface WalkProps extends WalkNewProps {
    createdAt: Date;
    updatedAt: Date;
}

export class Walk extends AggregateRoot<WalkProps> {
    private constructor(props: WalkProps, id?: string) {
        super(props, id);
    }

    static createNew(props: WalkNewProps): Result<Walk> {
        if (_.isNil(props.walkway) || _.isNil(props.user)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        return Result.ok(new Walk({
            ...props,
            status: this.getWalkStatusAndSetIfStatusIsUndefined(props),
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }

    static create(props: WalkProps, id: string): Result<Walk> {
        return Result.ok(new Walk(props, id));
    }

    get time(): WalkTime {
        return this.props.time;
    }

    get distance(): WalkDistance {
        return this.props.distance;
    }

    get finishStatus(): WALK_FINISH_STATUS {
        return this.props.finishStatus;
    }

    get status(): WALK_STATUS {
        return this.props.status;
    }

    get walkway(): Walkway {
        return this.props.walkway;
    }

    get user(): User {
        return this.props.user;
    }

    private static getWalkStatusAndSetIfStatusIsUndefined(props: WalkNewProps) {
        let { status } = props;
        if (_.isNil(props.status) || _.isEmpty(props.status)) {
            status = WalkStatus.NORMAL;
        }
        
        return status;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
