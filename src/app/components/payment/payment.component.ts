import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarDetailComponent } from '../car-detail/car-detail.component';
import { Rental } from '../../models/rental';
import { Payment } from 'src/app/models/payment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/services/payment.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],

})
export class PaymentComponent implements OnInit {
  paymentForm:FormGroup;
  payment:Payment;
  rental:Rental;
  constructor(
    private toastrService:ToastrService,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private rentalService:RentalService,
    private formBuilder:FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params)=> {
      this.rental = JSON.parse(params['rental']);
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
    console.log(this.paymentForm)
  }
  getPaymentDetails(){
    if (this.paymentForm.valid) {
      let paymentModel = Object.assign({},this.paymentForm.value);
      this.paymentService.check(paymentModel).subscribe((response)=>{
          this.toastrService.success("Kiralama isleminiz tamamlaniyor.","Odeme onaylandi")
          this.rentalService.addRental(this.rental)
        },responseError=>{
          this.toastrService.error("Odeme onaylanmadi, lutfen bilgilerinizi kontrol ediniz.","Hata")
        }
      ) 
    }else{
      this.toastrService.error('Formunuz eksik.','Dikkat')
    }
    }
}
