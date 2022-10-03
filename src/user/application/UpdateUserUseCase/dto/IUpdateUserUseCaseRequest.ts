export interface IUpdateUserUseCaseRequest {
    id: string;
    password?: string;
    name?: string;
    image?: string;
    goalDistance?: number;
    goalTime?: number;
    refreshToken?: string;
}
