import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { Car } from 'src/app/models/car';
import { CarDetail } from 'src/app/models/carDetail';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.css']
})
export class CarEditComponent implements OnInit {

  car:Car;
  carDetail:CarDetail;
  colors:Color[];
  brands:Brand[];
  carUpdateForm: FormGroup;

  constructor(
    private colorService:ColorService,
    private toastrService:ToastrService,
    private activatedRoute:ActivatedRoute,
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private carService: CarService,

  ) { }

  ngOnInit(): void {
    this.createCarUpdateForm();
    this.getColors();
    this.getBrands();
    this.activatedRoute.params.subscribe((params)=>{
      this.getCarById(params['carId'])
      this.getCarDetailsById(params['carId']);
    })
  }

  createCarUpdateForm(){
    this.carUpdateForm = this.formBuilder.group({
      carName: ['',Validators.required],
      brandId:['',Validators.required],
      colorId:['',Validators.required],
      modelYear:['',Validators.required],
      dailyPrice:['',Validators.required],
      description:['',Validators.required]
    });
  }

  getCarById(carId:number){
    this.carService.getCarById(carId).subscribe((response)=>{
      this.car=response.data;
    })
  }
  getCarDetailsById(carId: number) {
    this.carService.getCarDetailsById(carId).subscribe((response) => {
      this.carDetail = response.data;
    });
  }

  updateCar(){
    if (this.carUpdateForm.valid) {
      let carModel = Object.assign({}, this.carUpdateForm.value);
      carModel.id=this.car.id;
      console.log(carModel)
      this.carService.updateCar(carModel).subscribe((response)=>{
        this.toastrService.success(response.message, 'Basarili');
      },(responseError) =>{
        if (responseError.error.Errors.length>0) {
          for (let i = 0; i < responseError.error.Errors.length; i++) {
            this.toastrService.error(responseError.error.Errors[i].ErrorMessage, 'Dogrulama hatasi');
          }
        }
      }
      )
      
    }else{
      this.toastrService.error('Formunuz eksik','Dikkat')
    }
  }

  getColors(){
    this.colorService.getColors().subscribe((response)=> {
      this.colors=response.data;
    })
  }
  getBrands(){
    this.brandService.getBrands().subscribe((response)=> {
      this.brands=response.data;
    })
  }
}
