import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/models/payment';
import { SavePayment } from 'src/app/models/savePayment';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { SavepaymentService } from 'src/app/services/savepayment.service';
import * as CryptoJS from 'crypto-js';  

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  payment:Payment;
  currentUser:User;
  constructor(private authService:AuthService,private localStorageService:LocalstorageService,private savePaymentService:SavepaymentService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }
  
  getCurrentUser(){
    let mail = this.localStorageService.get('userEmail')
    this.authService.get(mail).subscribe(response=>{
      this.currentUser = response.data;
      // this.savePaymentService.get(this.currentUser.id).subscribe(response=>{
      //   let paymentDetails = response.data;
      //   var decrypted = CryptoJS.AES.decrypt(paymentDetails.details,'supersecretkey').toString(CryptoJS.enc.Utf8)
      //   this.payment=JSON.parse(decrypted)
      // })      
    })
  }
}
