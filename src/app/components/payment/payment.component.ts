import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarDetailComponent } from '../car-detail/car-detail.component';
import { Rental } from '../../models/rental';
import { Payment } from 'src/app/models/payment';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/services/payment.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],

})
export class PaymentComponent implements OnInit {
  form:any;
  payment:Payment;
  rental:Rental;
  constructor(
    private toastrService:ToastrService,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private rentalService:RentalService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params)=> {
      this.rental = JSON.parse(params['rental']);
    })
    console.log(this.rental);
    this.form = new FormGroup({
      name: new FormControl(),
      cardNumber: new FormControl(),
      exp: new FormControl(),
      cvv: new FormControl(),

    });
  }

  getPaymentDetails(){
    
    console.log(this.form)
    if (this.form.value.name == null ||this.form.value.cvv == null ||this.form.value.exp == null ||this.form.value.cardNumber == null ) {
      this.toastrService.error("Lutfen bilgileri eksiksiz giriniz","Hata")
    }else{
      console.log(this.form.value.cardNumber)
      let card:Payment ={
        cardNumber:this.form.value.cardNumber,
        name:this.form.value.name,
        cvv:this.form.value.cvv,
        exp:this.form.value.exp,
      }

      console.log(card.cardNumber)

      // this.payment.cardNumber=this.form.value.cardNumber;
      // this.payment.name=this.form.value.name;
      // this.payment.cvv=this.form.value.cvv;
      // this.payment.exp=this.form.value.exp;
      this.paymentService.check(card).subscribe((response)=>{
        console.log(response)
        if (response.success) {
          this.toastrService.success("Kiralama isleminiz tamamlaniyor.","Odeme onaylandi")
          this.rentalService.addRental(this.rental)
        }else{
          this.toastrService.error("Odeme onaylanmadi, lutfen bilgilerinizi kontrol ediniz.","Hata")
        }
      })
    }
  }
}
