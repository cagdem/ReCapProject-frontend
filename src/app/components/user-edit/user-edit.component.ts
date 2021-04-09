import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  currentUser: User;
  userUpdateForm: FormGroup;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalstorageService,
    private toastrService:ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.createUserUpdateForm();

  }

  getCurrentUser() {
    let mail = this.localStorageService.get('userEmail');
    this.authService.get(mail).subscribe((response) => {
      this.currentUser = response.data;
    });
  }

  createUserUpdateForm(){
    this.userUpdateForm = this.formBuilder.group({
      firstName: ['',Validators.required],
      lastName:['',Validators.required],
      password:['',Validators.required],
      email:['',Validators.required]
    });
  }

  updateUser(){
    console.log(this.userUpdateForm)
    if (this.userUpdateForm.valid) {
      let userModel = Object.assign({}, this.userUpdateForm.value);
      userModel.id=this.currentUser.id;
      console.log(userModel)
      this.authService.update(userModel).subscribe((response)=>{
        console.log(response)
        this.toastrService.success(response.message, 'Basarili');
        this.toastrService.info("Lutfen tekrar giris yapin.");
        this.localStorageService.clear()
        this.router.navigate(['login/']);
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
}
