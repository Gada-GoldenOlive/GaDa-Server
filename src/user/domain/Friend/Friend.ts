import _ from "lodash";

import { AggregateRoot } from "../../../common/domain/AggregateRoot";
import { Result } from "../../../common/presentationals/Result";
import { User } from "../User/User";
import { FriendStatus, FRIEND_STATUS } from "./FriendStatus";


export interface FriendNewProps {
    status?: FRIEND_STATUS;
    user1: User;
    user2: User;
}

export interface FriendProps extends FriendNewProps {
    createdAt: Date;
    updatedAt: Date;
}

export const PROPS_VALUES_ARE_REQUIRED = 'Props values are required.';

export class Friend extends AggregateRoot<FriendProps> {
    private constructor(props: FriendProps, id?: string) {
        super(props, id);
    }

    static createNew(props: FriendNewProps): Result<Friend> {
        if (_.isNil(props.user1) || _.isNil(props.user2)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        return Result.ok(new Friend({
            ...props,
            status: this.getFriendStatusAndSetIfStatusIsUndefined(props),
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }

    static create(props: FriendProps, id: string): Result<Friend> {
        return Result.ok(new Friend(props, id));
    }

    get status(): FRIEND_STATUS {
        return this.props.status;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    get user1(): User {
        return this.props.user1;
    }

    get user2(): User {
        return this.props.user2;
    }

    private static getFriendStatusAndSetIfStatusIsUndefined(props: FriendNewProps) {
        let { status } = props;
        if (_.isNil(props.status) || _.isEmpty(props.status)) {
            status = FriendStatus.NORMAL;
        }

        return status;
    }
}
