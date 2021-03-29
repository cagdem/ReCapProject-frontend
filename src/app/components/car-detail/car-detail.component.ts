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
import { CarDetailService } from 'src/app/services/car-detail.service';
import { CarService } from 'src/app/services/car.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css'],
})
export class CarDetailComponent implements OnInit {
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
    private toastrService:ToastrService,
    private carService: CarService,
    private carDetailService: CarDetailService,
    private activatedRoute: ActivatedRoute,
    private rentalService: RentalService,
    private router: Router
  ) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
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

  getRentalDetailsByCarId(carId: number) {
    this.rentalService.getRentalDetailsByCarId(carId).subscribe((response) => {
      let temp = response.data;

      this.carRentalDetails = temp;
      console.log(typeof this.carRentalDetails[0].returnDate);
      temp.forEach((t) => {
        console.log(t)
        t.rentDate = new Date(t.rentDate);

        if (t.returnDate != null) {
          t.returnDate = new Date(t.returnDate);
        }
      });
      console.log(typeof this.carRentalDetails[0].returnDate);
      //console.log(this.carRentalDetails[1].returnDate);
    });
  }

  addRental() {
      if(this.checkIfAvailable()){
        this.toastrService.success("Odeme sayfasina yonlendiriliyorsunuz","Basarili")
      this.fakeRental = {
        carId: this.car.carId,
        customerId: 3,
        rentDate: this.range.value.start._d,
        returnDate: this.range.value.end._d,
      };
      this.router.navigate(['payment/', JSON.stringify(this.fakeRental)]);
    }else{
      this.toastrService.error("Sectiginiz tarih araliginda araba baska bir musteridedir.","Hata")
    }
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
}
