import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarDetailComponent } from '../components/car-detail/car-detail.component';
import { Rental } from '../models/rental';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],

})
export class PaymentComponent implements OnInit {

  rental:Rental;
  constructor(
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params)=> {
      this.rental = JSON.parse(params['rental']);
    })
    console.log(this.rental);
  }

}
