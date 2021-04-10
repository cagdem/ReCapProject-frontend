import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NonlistResponseModel } from '../models/nonlistResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SavePayment } from '../models/savePayment';

@Injectable({
  providedIn: 'root'
})
export class SavepaymentService {

  apiUrl='https://localhost:44320/api/savepayments';
  constructor(private httpClient:HttpClient) { }

  add(payment:SavePayment):Observable<ResponseModel>{
    let newPath=this.apiUrl+"/add"
    return this.httpClient.post<ResponseModel>(newPath,payment)
  }
  get(userId:number):Observable<NonlistResponseModel<SavePayment>>{
    let newPath=this.apiUrl+"/getbyuserid?userId="+userId
    return this.httpClient.get<NonlistResponseModel<SavePayment>>(newPath)
  }
}
