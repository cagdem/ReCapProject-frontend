import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.css']
})
export class BrandEditComponent implements OnInit {

  brand:Brand;
  brandUpdateForm: FormGroup;

  constructor(
    private brandService:BrandService,
    private toastrService:ToastrService,
    private activatedRoute:ActivatedRoute,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.createBrandUpdateForm();
    this.activatedRoute.params.subscribe((params) => {
      this.getBrandByBrandId(params['brandId']);
    });
  }

  getBrandByBrandId(brandId:number){
    this.brandService.getBrandById(brandId).subscribe((response)=>{
      this.brand=response.data;
    })
  }

  createBrandUpdateForm(){
    this.brandUpdateForm = this.formBuilder.group({
      brandName: ['',Validators.required],
    })
    console.log(this.brandUpdateForm)
  }

  updateBrand(){
    if (this.brandUpdateForm.valid) {
      let brandModel = Object.assign({},this.brandUpdateForm.value);
      brandModel.brandId=this.brand.brandId;
      this.brandService.updateBrand(brandModel).subscribe((response)=>{
        this.toastrService.success(response.message, 'Basarili');
      },(responseError)=>{
        if(responseError.error.Errors.length>0){
          for (let i = 0; i < responseError.error.Errors.length; i++) {
            this.toastrService.error(responseError.error.Errors[i].ErrorMessage, 'Dogrulama hatasi');            
          }
        }
      })
      
    }else{
      this.toastrService.error('Formunuz eksik','Dikkat')
    }
  }
}
