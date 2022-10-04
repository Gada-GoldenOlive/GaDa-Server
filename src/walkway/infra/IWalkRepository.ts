import { IGetAllWalkUseCaseRequest } from '../application/GetAllWalkUseCase/dto/GetAllWalkUseCaseRequest';
import { Walk } from '../domain/Walk/Walk';

export const WALK_REPOSITORY = Symbol('WALK_REPOSITORY');

export interface IWalkRepository {
    findAll(request: IGetAllWalkUseCaseRequest): Promise<Walk[]>;
    findOne(id: string);
    save(walk: Walk): Promise<boolean>;
}
