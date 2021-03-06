import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Rental } from '../models/rental';
import { RentalDetail } from '../models/rentalDetail';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  apiUrl='https://localhost:44320/api/rentals';
  constructor(private httpClient: HttpClient) { }

  getRentalDetails():Observable<ListResponseModel<RentalDetail>>{
    let newPath = this.apiUrl + "/getrentaldetails";
    return this.httpClient.get<ListResponseModel<RentalDetail>>(newPath);
  }
  getRentalDetailsByCarId(carId:number):Observable<ListResponseModel<RentalDetail>>{
    let newPath = this.apiUrl + "/getrentaldetailsbycarid?carId="+carId;
    return this.httpClient.get<ListResponseModel<RentalDetail>>(newPath);
  }
  addRental(rental:Rental){
    let newPath = this.apiUrl + "/add";
    return this.httpClient.post(newPath,rental).subscribe();
  }
}
