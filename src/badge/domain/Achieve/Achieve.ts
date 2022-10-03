import _ from 'lodash';

import { AggregateRoot } from '../../../common/domain/AggregateRoot';
import { Result } from '../../../common/presentationals/Result';
import { User } from '../../../user/domain/User/User';
import { Badge } from '../Badge/Badge';
import { AchieveStatus, ACHIEVE_STATUS } from './AchieveStatus';

export interface AchieveNewProps {
	status?: ACHIEVE_STATUS;
	badge: Badge;
	user: User;
}

export interface AchieveProps extends AchieveNewProps {
	createdAt: Date;
	updatedAt: Date;
}

export const PROPS_VALUES_ARE_REQUIRED = 'Props values are required.';

export class Achieve extends AggregateRoot<AchieveProps> {
	private constructor(props: AchieveProps, id?: string) {
		super(props, id);
	}

	static createNew(props: AchieveNewProps): Result<Achieve> {
		if(_.isNil(props.badge) || _.isNil(props.user)) {
			return Result.fail(PROPS_VALUES_ARE_REQUIRED);
		}

		return Result.ok(new Achieve({
			...props,
			status: this.getAchieveStatusAndSetIfStatusIsUndefined(props),
			createdAt: new Date(),
			updatedAt: new Date(),
		}));
	}

	static create(props: AchieveProps, id: string): Result<Achieve> {
		return Result.ok(new Achieve(props, id));
	}

	private static getAchieveStatusAndSetIfStatusIsUndefined(props: AchieveNewProps) {
        let { status } = props;
        if (_.isNil(props.status) || _.isEmpty(props.status)) {
            status = AchieveStatus.NON_ACHIEVE;
        }
        
        return status;
    }

	get status(): ACHIEVE_STATUS {
		return this.props.status;
	}

	get badge(): Badge {
        return this.props.badge;
    }

	get user(): User {
        return this.props.user;
    }

	get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
