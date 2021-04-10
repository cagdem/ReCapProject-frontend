import {
  APP_BOOTSTRAP_LISTENER,
  Component,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
import { CarImage } from 'src/app/models/carImage';
import { Rental } from 'src/app/models/rental';
import { RentalDetail } from 'src/app/models/rentalDetail';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CarDetailService } from 'src/app/services/car-detail.service';
import { CarService } from 'src/app/services/car.service';
import { FindeksService } from 'src/app/services/findeks.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css'],
})
export class CarDetailComponent implements OnInit {

  currentUser:User;
  fakeRental: Rental;
  car: CarDetail;
  carRentalDetails: RentalDetail[];
  tempArray: RentalDetail[];
  carCount: number[];
  carImages: CarImage[];
  emptyImages: CarImage = { id: 0, carId: 0, date: 0, imagePath: '' };
  range: any;
  minDate: Date;

  constructor(
    private authService:AuthService,
    private toastrService:ToastrService,
    private carService: CarService,
    private carDetailService: CarDetailService,
    private activatedRoute: ActivatedRoute,
    private rentalService: RentalService,
    private router: Router,
    private findeksService: FindeksService,
    private localStorageService:LocalstorageService
  ) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.activatedRoute.params.subscribe((params) => {
      this.getCarDetailsById(params['carId']);
      this.getCarImages(params['carId']);
    });
    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
  }

  getCarDetailsById(carId: number) {
    this.carService.getCarDetailsById(carId).subscribe((response) => {
      this.car = response.data;
      //this.dataLoaded = true;
    });
  }
  getCarImages(carId: number) {
    this.carDetailService.getCarImages(carId).subscribe((response) => {
      if (response.data.length == 0) {
        this.emptyImages.imagePath = '\\assets\\images\\default.jpg';
        this.emptyImages.carId = carId;
        this.carImages = [this.emptyImages];
      } else {
        this.carImages = response.data;
      }
    });
  }

  getSliderClassName(index: number) {
    if (index == 0) {
      return 'carousel-item active';
    } else {
      return 'carousel-item';
    }
  }

  getButtonClassName(index: number) {
    if (index == 0) {
      return 'active';
    } else {
      return '';
    }
  }

  getRentalDetailsByCarId() {
    this.rentalService.getRentalDetailsByCarId(this.car.carId).subscribe((response) => {
      let temp = response.data;
      console.log(response)
      this.carRentalDetails = temp;
      temp.forEach((t) => {
        console.log(t)
        t.rentDate = new Date(t.rentDate);

        if (t.returnDate != null) {
          t.returnDate = new Date(t.returnDate);
        }
      });
      //console.log(typeof this.carRentalDetails[0].returnDate);
      //console.log(this.carRentalDetails[1].returnDate);
    });
  }

  rent(){
    if(this.checkIfAvailable()){    
      let userEmail = this.localStorageService.get('userEmail')
      if (userEmail!=null) {
      this.findeksService.check(userEmail,this.car.carId).subscribe(response=>{
        this.toastrService.success(response.message, 'Basarili');
        this.toastrService.success("Odeme sayfasina yonlendiriliyorsunuz","Basarili")
        this.addRental();        
      },responseError=>{
        this.toastrService.error("Findeks puaniniz yetersiz.","Hata")
        console.log(responseError)
      })  
      }
    }else{
      this.toastrService.error("Araba secilen tarihlerde uygun degildir. Lutfen baska tarih secin.","Hata")
    }
  }

  addRental() {
      this.fakeRental = {
        carId: this.car.carId,
        customerId: 3,//customer servis ile user servisin duzenlenmesi gerekiyor
        rentDate: this.range.value.start._d,
        returnDate: this.range.value.end._d,
      };
      this.router.navigate(['payment/', JSON.stringify(this.fakeRental)]);
  }

  checkIfAvailable(): Boolean | void {
    if(this.carRentalDetails!=undefined){
      for (const element of this.carRentalDetails) {
        if (element.returnDate == null) {
        return false;
      }
      if (element.returnDate> this.minDate) {
        if (this.range.value.start._d.getTime()<=element.returnDate.getTime() && 
        this.range.value.start._d.getTime()>=element.rentDate.getTime()) {
          return false
        }
        if (this.range.value.end._d.getTime()<=element.returnDate.getTime() && 
        this.range.value.end._d.getTime()>=element.rentDate.getTime()) {
          return false
        }  
      }
      }
  }
    return true;
  }

  getCurrentUser(){
    let userEmail = this.localStorageService.get('userEmail')
    this.authService.get(userEmail).subscribe(response=>{
      this.currentUser=response.data
    })
  }
}
