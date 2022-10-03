import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { User } from '../../../domain/User/User';

export interface IUpdateUserUseCaseResponse extends CoreResponse {
	user?: User;  // NOTE: 업데이트 된 다음에 정보 바로 주는 게 나을 것 같다고 판단
}
