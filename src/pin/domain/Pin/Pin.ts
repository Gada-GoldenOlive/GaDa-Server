import _ from 'lodash';

import { PinTitle } from './PinTitle';
import { PinContent } from './PinContent';
import { AggregateRoot } from '../../../common/domain/AggregateRoot';
import { Result } from '../../../common/presentationals/Result';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { PinStatus, PIN_STATUS } from './PinStatus';
import { Walkway } from '../../../walkway/domain/Walkway/Walkway';

import { PinLocation } from './PinLocation';
import { User } from '../../../user/domain/User/User';

export interface PinNewProps {
    title: PinTitle;
    content?: PinContent;
    image?: ImageUrl;
    location: PinLocation;
    walkway: Walkway;
    user: User;
    status?: PIN_STATUS;
}

export interface PinProps extends PinNewProps {
    createdAt: Date;
    updatedAt: Date;
}

export const PROPS_VALUES_ARE_REQUIRED = 'Props values are required.';

export class Pin extends AggregateRoot<PinProps> {
    private constructor(props: PinProps, id?: string) {
        super(props, id);
    }

    static createNew(props: PinNewProps): Result<Pin> {
        if (_.isNil(props.title) || _.isNil(props.content) || _.isNil(props.walkway) || _.isNil(props.user) || _.isNil(props.location)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        return Result.ok(new Pin({
            ...props,
            status: this.getPinStatusAndSetIfStatusIsUndefined(props),
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }

    static create(props: PinProps, id: string): Result<Pin> {
        return Result.ok(new Pin(props, id));
    }

    get title(): PinTitle {
        return this.props.title;
    }

    get content(): PinContent {
        return this.props.content;
    }

    get image(): ImageUrl {
        return this.props.image;
    }

    get location(): PinLocation {
        return this.props.location;
    }

    get status(): PIN_STATUS {
        return this.props.status;
    }
    
    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    get walkway(): Walkway {
        return this.props.walkway;
    }

    get user(): User {
        return this.props.user;
    }

    private static getPinStatusAndSetIfStatusIsUndefined(props: PinNewProps) {
        let { status } = props;
        if (_.isNil(props.status) || _.isEmpty(props.status)) {
            status = PinStatus.NORMAL;
        }
        
        return status;
    }
}
