import { Pin } from '../domain/Pin';

export const PIN_REPOSITORY = Symbol('PIN_REPOSITORY');

export interface IPinRepository {
    findOne(id: string): Promise<Pin>;
    save(pin: Pin): Promise<boolean>;
    findAll(walkwayId: string): Promise<Pin[]>;
}
