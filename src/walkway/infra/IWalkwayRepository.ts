import { Walkway } from "../domain/Walkway/Walkway";

export const WALKWAY_REPOSITORY = Symbol('WALKWAY_REPOSITORY');

export interface IWalkwayRepository {
    save(walkway: Walkway): Promise<boolean>;
    saveAll(walkways: Walkway[]): Promise<boolean>;
}
