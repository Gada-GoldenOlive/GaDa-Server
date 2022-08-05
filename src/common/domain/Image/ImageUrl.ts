import _ from 'lodash';
import { Result } from '../../presentationals/Result';
import { ValueObject } from '../ValueObject';

export interface ImageUrlProps {
    value: string;
}

export const IMAGE_URL_SHOULD_NOT_BE_EMPTY = 'ImageUrl should not be empty.';

export class ImageUrl extends ValueObject<ImageUrlProps> {
    constructor(props: ImageUrlProps) {
        super(props);
    }

    static create(url: string): Result<ImageUrl> {
        if (_.isEmpty(url)) {
            return Result.fail(IMAGE_URL_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new ImageUrl({ value: url }));
    }

    get value(): string {
        return this.props.value;
    }
}