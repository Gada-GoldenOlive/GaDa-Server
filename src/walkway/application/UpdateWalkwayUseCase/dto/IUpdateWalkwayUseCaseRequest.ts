import { WALKWAY_STATUS } from "../../../domain/Walkway/WalkwayStatus";

export interface IUpdateWalkwayUseCaseRequest {
    id: string;
    title?: string;
    image?: string;
    status?: WALKWAY_STATUS;
}
