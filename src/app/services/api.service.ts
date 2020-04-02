import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  reportDetail = new Array();
  reportName = new Array();
  private baseUrl = 'https://sheltered-dawn-67205.herokuapp.com/'
  //private baseUrl = 'http://localhost:3000/'

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
      "Access-Control-Allow-Origin": "*"
    })
  };
  constructor(private http: HttpClient) { }

  insertDate(data: any) {
    const urlApi = 'create';
    return this.http.post(this.baseUrl + urlApi, data);
  }
  searchDate(data: any) {
    const urlApi = 'search';
    this.reportName = data;
    return this.http.post(this.baseUrl + urlApi, data);
  }

}
