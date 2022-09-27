export interface IUpdateUserUseCaseRequest {
	id: string;
	loginId?: string;
    password?: string;
    name?: string;
    image?: string;
    goalDistance?: number;
    goalTime?: number;
}
