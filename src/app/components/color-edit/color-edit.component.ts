import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Color } from 'src/app/models/color';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-color-edit',
  templateUrl: './color-edit.component.html',
  styleUrls: ['./color-edit.component.css']
})
export class ColorEditComponent implements OnInit {

  color:Color;
  colorUpdateForm: FormGroup;

  constructor(
    private colorService:ColorService,
    private toastrService:ToastrService,
    private activatedRoute:ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createColorUpdateForm();
    this.activatedRoute.params.subscribe((params)=>{
      this.getColorByColorId(params['colorId'])
    })
  }

  getColorByColorId(colorId:number){
    this.colorService.getColorById(colorId).subscribe((response)=>{
      this.color=response.data;
    })
  }

  createColorUpdateForm(){
    this.colorUpdateForm = this.formBuilder.group({
      colorName: ['',Validators.required],
    })
    console.log(this.colorUpdateForm)
  }

  updateColor(){
    if (this.colorUpdateForm.valid) {
      let colorModel = Object.assign({},this.colorUpdateForm.value);
      colorModel.colorId=this.color.colorId;
      this.colorService.updateColor(colorModel).subscribe((response)=>{
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
