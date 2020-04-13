import { Injectable, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  @HostListener('window:beforeunload')
  beforReload() {
    
  }

  reportDetail = new Array();
  reportName = new Array();
  reloadData ;
   private baseUrl = 'https://sheltered-dawn-67205.herokuapp.com/'
  // private baseUrl = 'http://localhost:3000/'

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
      "Access-Control-Allow-Origin": "*"
    })
  };
  constructor(private http: HttpClient) { }

  insertDate(data: any) {
    this.reloadData = data ; 
    const urlApi = 'create';
    return this.http.post(this.baseUrl + urlApi, data);
  }
  searchDate(data: any) {
    sessionStorage.setItem('dataReload',JSON.stringify(data));
    this.reloadData = data ; 
    const urlApi = 'search';
    this.reportName = data;
    return this.http.post(this.baseUrl + urlApi, data) ;
  }

}
