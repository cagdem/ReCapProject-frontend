import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../models/car';
import { CarDetail } from '../models/carDetail';
import { ListResponseModel } from '../models/listResponseModel';
import { NonlistResponseModel } from '../models/nonlistResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  apiUrl='https://localhost:44320/api';
  constructor(private httpClient: HttpClient) { }

  getCarsDetails():Observable<ListResponseModel<CarDetail>>{
    let newPath = this.apiUrl + "/products/getcarsdetails"
   return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
  }
  getCarsByBrand(brandId:number):Observable<ListResponseModel<CarDetail>>{
    let newPath = this.apiUrl + "/products/getcardetailsbybrandid?brandId="+brandId;
    return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
  }
  getCarsByColor(colorId:number):Observable<ListResponseModel<CarDetail>>{
    let newPath = this.apiUrl + "/products/getcardetailsbycolorid?colorId="+colorId;
    return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
  }
  getCarDetailsById(carId:number):Observable<NonlistResponseModel<CarDetail>>{
    let newPath = this.apiUrl + "/products/getcardetails?carId="+carId;
    return this.httpClient.get<NonlistResponseModel<CarDetail>>(newPath);
  }
  addCar(car:Car):Observable<ResponseModel>{
    let newPath = this.apiUrl + "/products/add";
    return this.httpClient.post<ResponseModel>(newPath,car);
  }
}
