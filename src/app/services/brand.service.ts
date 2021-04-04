import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand';
import { ListResponseModel } from '../models/listResponseModel';
import { NonlistResponseModel } from '../models/nonlistResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  apiUrl='https://localhost:44320/api/brands';
  constructor(private httpClient: HttpClient) { }
  
  getBrands():Observable<ListResponseModel<Brand>>{
    let newPath = this.apiUrl + "/getall";
    return this.httpClient.get<ListResponseModel<Brand>>(newPath);
  }
  getBrandById(brandId:number):Observable<NonlistResponseModel<Brand>>{
    let newPath = this.apiUrl + "/getbyId?Id="+brandId;
    return this.httpClient.get<NonlistResponseModel<Brand>>(newPath)
  }
  addBrand(brand:Brand):Observable<ResponseModel>{
    let newPath = this.apiUrl + "/add";
    return this.httpClient.post<ResponseModel>(newPath,brand)
  }
  updateBrand(brand:Brand):Observable<ResponseModel>{
    let newPath = this.apiUrl + "/update";
    return this.httpClient.post<ResponseModel>(newPath,brand)
  }

}
