import { APP_BOOTSTRAP_LISTENER, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  carRentalDetails:RentalDetail[];
  carCount: number[];
  carImages: CarImage[];
  emptyImages: CarImage = { id: 0, carId: 0, date: 0, imagePath: '' };
  range: any;

  constructor(
    private carService: CarService,
    private carDetailService: CarDetailService,
    private activatedRoute: ActivatedRoute,
    private rentalService: RentalService
  ) {}

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
      this.carRentalDetails = response.data;
console.log(this.range.value.start._d)
console.log(this.range.value.start)
console.log(this.range.value.start._d.getTime())
console.log(this.range.value.end._d.getTime())








      this.carRentalDetails.forEach(carRentalDetail => {
         
        console.log(carRentalDetail.rentDate.valueOf())
        console.log(carRentalDetail.rentDate)
        
      });
    });  
  }

  addRental(){
    this.fakeRental={carId: this.car.carId,customerId: 100,rentDate:this.range.value.start._d,returnDate:this.range.value.end._d}
    this.rentalService.addRental(this.fakeRental);
  }
}
