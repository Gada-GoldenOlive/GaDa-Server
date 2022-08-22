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
        //TOOD: 여기 return Result.fail(IMAGE_URL_SHOULD_NOT_BE_EMPTY); 같은 걸로 바꾸고 Usecase도 수정 필요할듯??
        if (_.isEmpty(url)) {
            return null;
        }
        
        return Result.ok(new ImageUrl({ value: url }));
    }

    get value(): string {
        return this.props.value;
    }
}
