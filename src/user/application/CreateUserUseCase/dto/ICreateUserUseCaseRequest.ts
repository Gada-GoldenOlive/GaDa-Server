export interface ICreateUserUseCaseRequest {
	userId: string;
	password: string;
	name: string;
	image?: string;
}
