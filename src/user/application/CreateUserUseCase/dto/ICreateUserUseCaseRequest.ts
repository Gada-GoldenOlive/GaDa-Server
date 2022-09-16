export interface ICreateUserUseCaseRequest {
	loginId: string;
	password: string;
	name: string;
	image?: string;
}
