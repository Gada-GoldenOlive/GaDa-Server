export interface ICreateBadgeUseCaseRequest {
	title: string;
	image: string;
	category: string;
	code: string;
	status?: string;  // HIDDEN 배지는 post단계에서부터 HIDDEN으로 넣어주므로 필요함
}
