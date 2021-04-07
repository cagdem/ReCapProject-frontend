import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class FindeksService {

  apiUrl = 'https://localhost:44320/api/findeks';

  constructor(private httpClient:HttpClient) { }

  check(userEmail:string,carId:number){
    let newPath = this.apiUrl + "/check?userEmail="+userEmail+"&carId="+carId;
    return this.httpClient.get<ResponseModel>(newPath)
  }
}
