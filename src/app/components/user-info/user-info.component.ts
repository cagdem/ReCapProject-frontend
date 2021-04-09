import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  currentUser:User;
  constructor(private authService:AuthService,private localStorageService:LocalstorageService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }
  
  getCurrentUser(){
    let mail = this.localStorageService.get('userEmail')
    this.authService.get(mail).subscribe(response=>{
      this.currentUser = response.data;
    })

  }
}
