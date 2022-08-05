import { AggregateRoot } from '../../common/domain/AggregateRoot';
import { Image } from '../../common/domain/Image';
import { Result } from '../../common/presentationals/Result';
import { UserName } from './UserName';

export interface UserNewProps {
    name: UserName;
    image: Image;
}

export interface UserProps extends UserNewProps {
    createdAt: Date;
    updatedAt: Date;
}

export class User extends AggregateRoot<UserProps> {
    private constructor(props: UserProps, id?: string) {
        super(props, id);
    }

    static createNew(props: UserNewProps): Result<User> {
        return Result.ok(new User({
            ...props,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }

    static create(props: UserProps, id: string): Result<User> {
        return Result.ok(new User(props, id));
    }

    get name(): UserName {
        return this.props.name;
    }

    get image(): Image {
        return this.props.image;
    }
}