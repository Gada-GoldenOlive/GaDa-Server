export interface IUpdateUserUseCaseRequest {
    id: string;
    password?: string;
    name?: string;
    image?: string;
    totalDistance?: number;
    totalTime?: number;
    goalDistance?: number;
    goalTime?: number;
    refreshToken?: string;
}
