import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css']
})
export class NaviComponent implements OnInit {
  status:boolean
  userEmail:string;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.isLoggedin();
  }

  isLoggedin(){
  //  this.userEmail=this.localStorageService.get("userEmail");
    this.status = this.authService.isAuthenticated();
  }
}
