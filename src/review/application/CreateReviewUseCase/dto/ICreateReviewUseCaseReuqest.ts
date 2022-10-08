import { Walk } from "../../../../walkway/domain/Walk/Walk";
import { VEHCILE_STATUS } from "../../../domain/Review/Vehicle";

export interface ICreateReviewUseCaseRequest {
    title: string;
    vehicle: VEHCILE_STATUS;
    star: number;
    content: string;
    images?: string[];
    walk: Walk;
}
