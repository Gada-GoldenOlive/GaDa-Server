import { PIN_STATUS } from "../../../domain/Pin/PinStatus";

export interface IUpdatePinUseCaseRequest {
    id: string;
    title?: string;
    content?: string;
    image?: string;
}
