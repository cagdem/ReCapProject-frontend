import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rental } from '../../models/rental';
import { Payment } from 'src/app/models/payment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/services/payment.service';
import { RentalService } from 'src/app/services/rental.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

import * as CryptoJS from 'crypto-js';  
import { SavePayment } from 'src/app/models/savePayment';
import { User } from 'src/app/models/user';
import { SavepaymentService } from 'src/app/services/savepayment.service';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],

})
export class PaymentComponent implements OnInit {
  savedPayment:Payment
  paymentForm:FormGroup;
  paymentDetails:SavePayment;
  rental:Rental;
  currentUser:User;
  isPaymentFound:Boolean;
  status:Boolean=false;

  constructor(
    private toastrService:ToastrService,
    private authService:AuthService,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private rentalService:RentalService,
    private formBuilder:FormBuilder,
    private localStorageService:LocalstorageService,
    private savePaymentService:SavepaymentService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params)=> {
      this.rental = JSON.parse(params['rental']);
    })
    this.authService.get(this.localStorageService.get('userEmail')).subscribe(response=>{
      this.currentUser =response.data
        this.savePaymentService.get(this.currentUser.id).subscribe(response=>{
        if (response.data==null) {
          this.isPaymentFound=false;
        }else{
          this.isPaymentFound=true;
        let paymentDetails = response.data;
        var decrypted = CryptoJS.AES.decrypt(paymentDetails.details,'supersecretkey').toString(CryptoJS.enc.Utf8)
        this.savedPayment=JSON.parse(decrypted)
        console.log(this.savedPayment)}
      })  
    })
    console.log(this.rental);
    this.createPaymentForm();
  }

  createPaymentForm(){
    this.paymentForm=this.formBuilder.group({
      name:['',Validators.required],
      cardNumber:['',Validators.required],
      exp:['',Validators.required],
      cvv:['',Validators.required],
    })
  }
  getPaymentDetails(){
    if (this.paymentForm.valid) {
      let paymentModel = Object.assign({},this.paymentForm.value);
      this.paymentService.check(paymentModel).subscribe((response)=>{
        if (response.success) {
          this.toastrService.success("Kiralama isleminiz tamamlaniyor.","Odeme onaylandi")
          this.rentalService.addRental(this.rental)         
        }else{
          this.toastrService.error("Odeme onaylanmadi, lutfen bilgilerinizi kontrol ediniz.","Hata")
        }
        }
      ) 
    }else{
      this.toastrService.error('Formunuz eksik.','Dikkat')
    }
    }

    savePaymentDetails(){
      let paymentModel = Object.assign({},this.paymentForm.value);

      let details = JSON.stringify(paymentModel)
      var encrypted = CryptoJS.AES.encrypt(details,'supersecretkey').toString() // 'supersecretkey' yerine kisinin sifresiyle sifrelemek daha mantikli olabilir
      //console.log(encrypted)
      //var originalText = CryptoJS.AES.decrypt(encrypted,'supersecretkey').toString(CryptoJS.enc.Utf8)
      //console.log(originalText)
      this.paymentDetails={
        details:encrypted,
        userId:this.currentUser.id
      }
      this.savePaymentService.add(this.paymentDetails).subscribe(response=>{
        this.toastrService.success(response.message,'Basarili')
      },responseError=>{
        this.toastrService.error(responseError.message,'Hata')
      })
    }

    enterNewPayment(){
      this.status=true;
    }

    useSavedPayment(){
        this.paymentService.check(this.savedPayment).subscribe((response)=>{
          if (response.success) {
            this.toastrService.success("Kiralama isleminiz tamamlaniyor.","Odeme onaylandi")
            this.rentalService.addRental(this.rental)         
          }else{
            this.toastrService.error("Odeme onaylanmadi, lutfen bilgilerinizi kontrol ediniz.","Hata")
          }
          }
        ) 
    }
}
