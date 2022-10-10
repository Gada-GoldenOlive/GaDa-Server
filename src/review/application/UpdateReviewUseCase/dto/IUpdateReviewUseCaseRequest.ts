import { VEHCILE_STATUS } from "../../../domain/Review/Vehicle";

export interface IUpdateReviewUseCaseRequest {
    id: string;
    title: string;
    vehicle: VEHCILE_STATUS;
    star: number;
    content: string;
}
