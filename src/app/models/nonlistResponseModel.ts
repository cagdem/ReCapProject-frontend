import { ResponseModel } from "./responseModel";

export interface NonResponseModel<T> extends ResponseModel{
    data: T;
}