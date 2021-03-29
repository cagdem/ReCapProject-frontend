import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Rental } from '../models/rental';
import { RentalDetail } from '../models/rentalDetail';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  apiUrl='https://localhost:44320/api/';
  constructor(private httpClient: HttpClient) { }

  getRentalDetails():Observable<ListResponseModel<RentalDetail>>{
    let newPath = this.apiUrl + "rentals/getrentaldetails";
    return this.httpClient.get<ListResponseModel<RentalDetail>>(newPath);
  }
  getRentalDetailsByCarId(carId:number):Observable<ListResponseModel<RentalDetail>>{
    let newPath = this.apiUrl + "rentals/getrentaldetailsbycarid?carId="+carId;
    return this.httpClient.get<ListResponseModel<RentalDetail>>(newPath);
  }
  addRental(rental:Rental){
    let newPath = this.apiUrl + "rentals/add";
    return this.httpClient.post(newPath,rental).subscribe();
  }
}
