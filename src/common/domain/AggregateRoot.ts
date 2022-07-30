import { v4 as uuidv4 } from 'uuid';

interface AggregateObjectProps {
  [index: string]: any;
}

export abstract class AggregateRoot<T extends AggregateObjectProps> {
  public props: T;
  protected readonly _id;

  protected constructor(props: T, id?: string) {
    this.props = {
      ...props,
    };

    if (!id) {
      id = uuidv4();
    }

    this._id = id;
  }

  get id(): string {
    return this._id;
  }
}
