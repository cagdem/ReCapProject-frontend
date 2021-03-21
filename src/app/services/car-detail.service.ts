import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarDetail } from '../models/carDetail';
import { CarImage } from '../models/carImage';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CarDetailService {

  apiUrl='https://localhost:44320/api';
  constructor(private httpClient:HttpClient) { }

   getCarDetailsById(carId:number):Observable<ListResponseModel<CarDetail>>{
     let newPath = this.apiUrl + "/products/getcardetails?carId="+carId;
     return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
   }
  getCount(carId:number):Observable<ListResponseModel<number>>{
    let newPath = this.apiUrl + "/carimages/getCount?carId="+carId;
    return this.httpClient.get<ListResponseModel<number>>(newPath);
  }
  getCarImages(carId:number):Observable<ListResponseModel<CarImage>>{
    let newPath = this.apiUrl + "/carimages/list?carId="+carId;
    return this.httpClient.get<ListResponseModel<CarImage>>(newPath);
  }
}
