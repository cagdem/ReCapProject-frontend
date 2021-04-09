import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  get(key:string):any{
    return localStorage.getItem(key);
  }
  set(key:string,value:any){
    localStorage.setItem(key,value)
  }
  delete(key:string){
    localStorage.removeItem(key)
  }
  clear(){
    localStorage.clear()
  }
}
