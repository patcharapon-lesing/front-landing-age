import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ReportDetailModel } from '../model/reportDetailModel'
import { ExcelService } from '../services/excel.services';

@Component({
  selector: 'app-find-case-page',
  templateUrl: './find-case-page.component.html',
  styleUrls: ['./find-case-page.component.css']
})
export class FindCasePageComponent implements OnInit {

  caseIdPattern: string;
  dateFrom: any;
  dateTo: any;
  caseId: string;
  butSubmit: boolean;
  reportDetailModel: ReportDetailModel = new ReportDetailModel();
  constructor(
    private router: Router,
    private apiService: ApiService,
    private excelService: ExcelService,
  ) { }
  ngOnInit(): void {
    this.butSubmit = false;
    this.caseIdPattern = "";
  }
  ngDoCheck() {
    this.butSubmit = false;
    this.caseId = (document.getElementById('caseId') as HTMLInputElement).value
    if ((document.getElementById('dateFrom') as HTMLInputElement).value !== '' && (document.getElementById('dateTo') as HTMLInputElement).value !== '') {
      this.butSubmit = true;
    } else if (this.caseId !== '' && this.caseId !== undefined && this.caseId !== null) {
      this.butSubmit = true;
    }
  }
  butGoCreateCasePage(): void { this.router.navigate(['CreateCasePage']); }
  butGoFindCasePage(): void { this.router.navigate(['']); }
  butGoDetailsPage(): void {
    this.router.navigate(['DetailsPage']);
    if ( !(document.getElementById('caseId') as HTMLInputElement).value  ) {
      (document.getElementById('caseId') as HTMLInputElement).value  = '';
    }
    let caseId = (document.getElementById('caseId') as HTMLInputElement).value
    let dateFrom = (document.getElementById('dateFrom') as HTMLInputElement).value
    let dateTo = (document.getElementById('dateTo') as HTMLInputElement).value
    let filesname = "";
    if ((document.getElementById('caseId') as HTMLInputElement).value.length !== 0) { 
      filesname = caseId
     } else {
      filesname = dateFrom + "-" + dateTo;
    }
    this.excelService.excelFileName = filesname;
  }
  onSubmit(caseIdVal: string, caseIdValid: any): void {
    this.alertLoading(true);
    // Do input CaseID
    if (caseIdValid === true && caseIdVal.length > 0) {
      let data = { caseID: (document.getElementById('caseId') as HTMLInputElement).value }
      this.search(data);
    }
    else { //Do input Date
      if (this.validForm(caseIdValid) === true) {
        let dateFrom = (document.getElementById('dateFrom') as HTMLInputElement).value;
        let dateTo = (document.getElementById('dateTo') as HTMLInputElement).value;
        let data = {
          stDate: dateFrom.toString().substring(6, 10) + "-" + (dateFrom.toString().substring(3, 5)) + "-" + dateFrom.toString().substring(0, 2),
          enDate: dateTo.toString().substring(6, 10) + "-" + (dateTo.toString().substring(3, 5)) + "-" + dateTo.toString().substring(0, 2)
        }
        this.search(data);
      }
    }
  }

  validForm(caseIdValid: any): boolean {
    if (caseIdValid === false && (document.getElementById('caseId') as HTMLInputElement).value !== "") {
      this.alertCalling("ระบุข้อมูลไม่ถูกต้อง"); return false;
    }
    if ( (document.getElementById('dateFrom') as HTMLInputElement).value !== ''
      && (document.getElementById('dateTo') as HTMLInputElement).value !== '') {
      const dateFrom = (document.getElementById('dateFrom') as HTMLInputElement).value;
      const dateTo = (document.getElementById('dateTo') as HTMLInputElement).value;
      const v_dateFrom: Date = new Date();
      v_dateFrom.setFullYear(Number(dateFrom.toString().substring(6, 10)));;
      v_dateFrom.setMonth(Number(dateFrom.toString().substring(3, 5)) - 1);
      v_dateFrom.setDate(Number(dateFrom.toString().substring(0, 2)));
      const v_dateTo: Date = new Date();
      v_dateTo.setFullYear(Number(dateTo.toString().substring(6, 10)));;
      v_dateTo.setMonth(Number(dateTo.toString().substring(3, 5)) - 1);
      v_dateTo.setDate(Number(dateTo.toString().substring(0, 2)));
      if (v_dateFrom.getTime() > v_dateTo.getTime()) {
        this.alertCalling("วันที่ไม่ถูกต้อง");
        
        return false;
      } else { return true; }
    }
  }

  clearVal(val: string): void {

    if (val === "blkDate") {
      (document.getElementById('dateFrom') as HTMLInputElement).value = '';
      (document.getElementById('dateTo') as HTMLInputElement).value = '';
      this.dateFrom = '';
      this.dateTo = '';
    } else if (val === "blkCaseId") {
      (document.getElementById('caseId') as HTMLInputElement).value = '';
      this.caseId = '';
    }
  }
  search(data: any) {
    this.apiService.searchDate(data).subscribe((res: any) => {
      if (res.resultCode === "20000") {
        if (res.data.length > 0) {
          this.alertLoading(false);
          this.reportDetailModel.ObjReportDetail = res.data;
          this.apiService.reportDetail = this.reportDetailModel.ObjReportDetail;
          this.butGoDetailsPage();
        } else {
          this.alertLoading(false);
          this.alertCalling("ไม่พบข้อมูล");
        }
      } else { this.alertCalling("ผิดพลาด! ไม่สามารถทำรายการได้ในขณะนี้"); this.alertLoading(false); }
    });
  }
  msg : string;
  alertCalling(msg: string):void {
    this.msg = msg ;
    let element: HTMLInputElement = document.getElementById('callAlert') as HTMLInputElement ;
    element.style.display = "block" ;
    element.click();
    this.alertLoading(false);
  }

  alertLoading(val: boolean):void {
    if ( val === true ) {
      let element: HTMLInputElement = document.getElementById('modalLoading') as HTMLInputElement ;
      element.style.display = "block" ;
      element.click();
    } else if ( val === false ) {
      let element: HTMLInputElement = document.getElementById('closeModalLoading') as HTMLInputElement ;
      element.style.display = "none" ;
      element.click();
    }
  }

}
