import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarDetail } from 'src/app/models/carDetail';
import { CarImage } from 'src/app/models/carImage';
import { CarDetailService } from 'src/app/services/car-detail.service';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css'],
})
export class CarDetailComponent implements OnInit {
  cars: CarDetail[];
  carCount: number[];
  carImages: CarImage[];
  emptyImages: CarImage={id:0,carId:0,date:0,imagePath:''};

  constructor(
    private carService: CarService,
    private carDetailService: CarDetailService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.getCarDetailsById(params['carId']);
      this.getCarImages(params['carId']);
    });
  }

  getCarDetailsById(carId: number) {
    this.carService.getCarDetailsById(carId).subscribe((response) => {
      this.cars = response.data;
      //this.dataLoaded = true;
    });
  }
  getCarImages(carId: number) {
    this.carDetailService.getCarImages(carId).subscribe((response) => {
      if (response.data.length == 0) {
        this.emptyImages.imagePath="\\assets\\images\\default.jpg";
        this.emptyImages.carId=carId;
        this.carImages=[this.emptyImages];
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
}
