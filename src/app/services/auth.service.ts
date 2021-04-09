import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from '../models/loginModel';
import { NonlistResponseModel } from '../models/nonlistResponseModel';
import { RegisterModel } from '../models/registerModel';
import { TokenModel } from '../models/tokenModel';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'https://localhost:44320/api/auth';
  constructor(private httpClient:HttpClient, private localStorageService:LocalstorageService) { }

  login(user:LoginModel){
    return this.httpClient.post<NonlistResponseModel<TokenModel>>(this.apiUrl+"/login",user)
  }
  register(user:RegisterModel){
    return this.httpClient.post<NonlistResponseModel<TokenModel>>(this.apiUrl+"/register",user)
  }
  get(userEmail:string){
    return this.httpClient.get<NonlistResponseModel<RegisterModel>>(this.apiUrl+"/get?userEmail="+userEmail)
  }
  update(user:RegisterModel){
    return this.httpClient.post<NonlistResponseModel<TokenModel>>(this.apiUrl+"/update",user)
  }

  isAuthenticated(){
    var currentTime = new Date().getTime()
    var exp = new Date(this.localStorageService.get('exp')).getTime()
    console.log([currentTime,exp])
    if(currentTime<exp){
      return true;
    }else{
      this.localStorageService.delete('token')
      this.localStorageService.delete('exp')
      this.localStorageService.delete('userEmail')
      return false;
    }
  }

}
