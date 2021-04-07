import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-car-add',
  templateUrl: './car-add.component.html',
  styleUrls: ['./car-add.component.css']
})
export class CarAddComponent implements OnInit {

  carAddForm: FormGroup;
  colors:Color[];
  brands:Brand[];

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private toastrService: ToastrService,
    private carService: CarService,
    private colorService: ColorService
  ) { }

  ngOnInit(): void {
    this.createCarAddForm();
    this.getColors();
    this.getBrands();
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
  createCarAddForm(){
    this.carAddForm = this.formBuilder.group({
      carName: ['',Validators.required],
      brandId:['',Validators.required],
      colorId:['',Validators.required],
      modelYear:['',Validators.required],
      dailyPrice:['',Validators.required],
      description:['',Validators.required]
    });
  }

  addCar(){
    if (this.carAddForm.valid) {
      let carModel = Object.assign({}, this.carAddForm.value);
      console.log(carModel)
      this.carService.addCar(carModel).subscribe((response)=>{
        this.toastrService.success(response.message, 'Basarili');
      },(responseError) =>{
        if (!responseError.error.success) {
          console.log(responseError)
          this.toastrService.error(
            responseError.error.message, 'Kural hatasi'
          )
        }else if (responseError.error.errors.length>0) {
          for (let i = 0; i < responseError.error.errors.length; i++) {
            this.toastrService.error(responseError.error.errors[i].ErrorMessage, 'Dogrulama hatasi');
          }
        }
      }
      )
      
    }else{
      this.toastrService.error('Formunuz eksik','Dikkat')
    }
  }

}
