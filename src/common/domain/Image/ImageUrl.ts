import _ from 'lodash';

import { Result } from '../../presentationals/Result';
import { ValueObject } from '../ValueObject';

export interface ImageUrlProps {
    value: string;
}

export class ImageUrl extends ValueObject<ImageUrlProps> {
    constructor(props: ImageUrlProps) {
        super(props);
    }

    static create(url: string): Result<ImageUrl> {
        if (_.isEmpty(url)) {
            return null;
        }

        return Result.ok(new ImageUrl({ value: url }));
    }

    get value(): string {
        return this.props.value;
    }
}
