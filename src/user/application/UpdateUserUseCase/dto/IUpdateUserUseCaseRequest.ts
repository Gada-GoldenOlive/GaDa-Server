export interface IUpdateUserUseCaseRequest {
    id: string;
    originPassword?: string;
    password?: string;
    name?: string;
    image?: string;
    goalDistance?: number;
    goalTime?: number;
    refreshToken?: string;
}
