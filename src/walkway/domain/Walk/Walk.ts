import { AggregateRoot } from "../../../common/domain/AggregateRoot";
import { Result } from "../../../common/presentationals/Result";
import { WalkDistance } from "./WalkDistance";
import { WALK_FINISH_STATUS } from "./WalkFinishStatus";
import { WalkTime } from "./WalkTime";

export interface WalkNewProps {
    time: WalkTime,
    distance: WalkDistance,
    isFinished: WALK_FINISH_STATUS,
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
        return Result.ok(new Walk({
            ...props,
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

    get isFinish(): WALK_FINISH_STATUS {
        return this.props.isFinished;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
