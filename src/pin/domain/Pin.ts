import _ from 'lodash';

import { PinTitle } from './PinTitle';
import { PinContent } from './PinContent';
import { AggregateRoot } from '../../common/domain/AggregateRoot';
import { Result } from '../../common/presentationals/Result';
import { ImageUrl } from '../../common/domain/Image/ImageUrl';

export interface PinNewProps {
    title: PinTitle;
    content?: PinContent;
    image?: ImageUrl;
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
        if (_.isNil(props.title) || _.isNil(props.content)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        return Result.ok(new Pin({
            ...props,
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
    
    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
