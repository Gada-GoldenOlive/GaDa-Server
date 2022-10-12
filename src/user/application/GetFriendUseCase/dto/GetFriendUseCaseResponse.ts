import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Friend } from "../../../domain/Friend/Friend";

export interface IGetFriendUseCaseResponse extends CoreResponse {
    friend?: Friend;
}
