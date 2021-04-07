import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm:FormGroup;
  constructor(private formBuilder:FormBuilder,private authService:AuthService,private toastrService: ToastrService,private localStorageService:LocalstorageService) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm(){
    this.registerForm=this.formBuilder.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      email:['',Validators.required],
      password:['',Validators.required]
    })
  }

  register(){
    if(this.registerForm.valid){
      let registerModel = Object.assign({},this.registerForm.value)

      this.authService.register(registerModel).subscribe(response=>{
        this.toastrService.info(response.message)
        this.localStorageService.set('token',response.data.token)
        this.localStorageService.set('exp',response.data.expiration)
        this.localStorageService.set('userEmail',registerModel.email)
      },responseError=>{
        this.toastrService.error(responseError.error)
      })
    }
  }
}
