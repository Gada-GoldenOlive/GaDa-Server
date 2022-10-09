export interface IUpdateUserUseCaseRequest {
    id: string;
    originPassword?: string;
    password?: string;
    name?: string;
    image?: string;
    totalDistance?: number;
    totalTime?: number;
    goalDistance?: number;
    goalTime?: number;
    refreshToken?: string;
}
