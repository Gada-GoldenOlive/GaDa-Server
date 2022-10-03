import _ from 'lodash';

import { BadgeTitle } from './BadgeTitle';
import { AggregateRoot } from '../../../common/domain/AggregateRoot';
import { Result } from '../../../common/presentationals/Result';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { BadgeStatus, BADGE_STATUS } from './BadgeStatus';
import { BADGE_CATEGORY } from './BadgeCategory';
import { BADGE_CODE } from './BadgeCode';

export interface BadgeNewProps {
    title: BadgeTitle;
    image: ImageUrl;
    category: BADGE_CATEGORY;
    code: BADGE_CODE;
	status?: BADGE_STATUS;
}

export interface BadgeProps extends BadgeNewProps {
    createdAt: Date;
    updatedAt: Date;
}

export const PROPS_VALUES_ARE_REQUIRED = 'Props values are required.';

export class Badge extends AggregateRoot<BadgeProps> {
    private constructor(props: BadgeProps, id?: string) {
        super(props, id);
    }

    static createNew(props: BadgeNewProps): Result<Badge> {
        if (_.isNil(props.title) || _.isNil(props.image) || _.isNil(props.category)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        return Result.ok(new Badge({
            ...props,
            status: this.getBadgeStatusAndSetIfStatusIsUndefined(props),
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }

    static create(props: BadgeProps, id: string): Result<Badge> {
        return Result.ok(new Badge(props, id));
    }

    get title(): BadgeTitle {
        return this.props.title;
    }

    get image(): ImageUrl {
        return this.props.image;
    }

    get category(): BADGE_CATEGORY {
        return this.props.category;
    }

    get code(): BADGE_CODE {
        return this.props.code;
    }

    get status(): BADGE_STATUS {
        return this.props.status;
    }
    
    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
 
    private static getBadgeStatusAndSetIfStatusIsUndefined(props: BadgeNewProps) {
        let { status } = props;
        if (_.isNil(props.status) || _.isEmpty(props.status)) {
            status = BadgeStatus.NORMAL;
        }
        
        return status;
    }
}
