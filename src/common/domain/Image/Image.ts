import _ from 'lodash';

import { Result } from '../../presentationals/Result';
import { AggregateRoot } from '../AggregateRoot';
import { ImageUrl } from './ImageUrl';

export interface ImageNewProps {
    url: ImageUrl;
}

export interface ImageProps extends ImageNewProps {
    createdAt: Date;
    updatedAt: Date;
}

export const PROPS_VALUES_ARE_REQUIRED = 'Props values are required.';

export class Image extends AggregateRoot<ImageProps> {
    constructor(props: ImageProps, id?: string) {
        super(props, id);
    }

    static createNew(props: ImageNewProps): Result<Image> {
        if (_.isNil(props.url)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        return Result.ok(new Image({
            ...props,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }

    static create(props: ImageProps, id: string): Result<Image> {
        return Result.ok(new Image(props, id));
    }

    get url(): ImageUrl {
        return this.props.url;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
    
    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
