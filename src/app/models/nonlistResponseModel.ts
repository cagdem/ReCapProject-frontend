import { ResponseModel } from "./responseModel";

export interface NonlistResponseModel<T> extends ResponseModel{
    data: T;
}