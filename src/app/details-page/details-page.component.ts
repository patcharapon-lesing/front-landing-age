import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ExcelService } from '../services/excel.services';
import { ReportDetailModel } from '../model/reportDetailModel';
import { ApiService } from '../services/api.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { async, TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent implements OnInit {

  reloadData = new Array();;
  dip = false;
  data = new Array();
  dataReserve = new Array();
  headers = new Array();
  reportDetailModel: ReportDetailModel = new ReportDetailModel();
  DataImg = new Array();
  dataExpXlsx = new Array();
  excelFileName: string;
  buttonSort = { "caseID" : false , "topic": false , "statusCase": false , "dateCreate" : false }
  constructor(
    private router: Router,
    private excelService: ExcelService,
    private apiService: ApiService,
    config: NgbCarouselConfig
  ) {
    this.headers = ['No.', 'Case ID', 'Topic', 'Description', 'Date Create', 'Create by', 'Status'];
    this.data = this.apiService.reportDetail;
    config.showNavigationIndicators = false;
  }

  ngOnInit(): void {
    if (this.data.length <= 0) {
      this.alertLoading(true);
      this.search(JSON.parse(sessionStorage.getItem("dataReload")));
    } else {
      this.reloadData = this.apiService.reloadData;
      this.converseData();
      this.sortData('caseID',true);
      this.alertLoading(false);
    }
  }

  butGoFindCasePage(): void {
    this.router.navigate(['']);
  }

  butExportAsXLSX(): void {
    this.excelFileName = sessionStorage.getItem('excelFileName');
    if (this.excelFileName === null || this.excelFileName === undefined || this.excelFileName === "") {
      this.alertCalling("ผิดพลาด ไม่สามารถทำรายการได้!")
    }
    this.excelService.exportAsExcelFile(this.headers, this.dataExpXlsx, this.excelFileName);
  }

  converseData(): void {
    let setDataXlsx = new Array();
    let setDataTable = new Array();
    let num = 0;
    for (let i in this.data) {
      let d = this.data[i].createDate;
      let daySrt = d.substr(8, 2) + "/" + d.substr(5, 2) + "/" + d.substr(0, 4);
      let timeSrt = d.substr(11, 8); // <-- Show Time
      setDataXlsx.push({
        No: num + 1,
        caseID: this.data[i].caseID,
        topic: this.data[i].topic,
        description: this.data[i].description,
        createDate: daySrt,
        caseBy: this.data[i].caseBy,
        statusCase: this.data[i].statusCase,
      });
      setDataTable.push({
        No: num + 1,
        caseID: this.data[i].caseID,
        topic: this.data[i].topic,
        description: this.data[i].description,
        createDate: daySrt,
        caseBy: this.data[i].caseBy,
        statusCase: this.data[i].statusCase,
        image: this.data[i].image,
        showDetail: false
      });
      num++;
    }
    this.dataExpXlsx = setDataXlsx;
    this.data = setDataTable;
    this.dataReserve = this.data;
  }

  showImg(vCaseId): void {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].caseID
      if (this.data[i].caseID === vCaseId) {
        this.DataImg = this.data[i].image
        let element: HTMLInputElement = document.getElementById('clickShowImg') as HTMLInputElement;
        element.style.display = "block";
        element.click();

      } else {

      }
    }
  }
  async search(data: any) {
    await this.apiService.searchDate(data).subscribe(async (res: any) => {
      if (res.resultCode === "20000") {
        if (res.data.length > 0) {
          this.reportDetailModel.ObjReportDetail = res.data;
          this.apiService.reportDetail = this.reportDetailModel.ObjReportDetail;
          this.data = this.reportDetailModel.ObjReportDetail;
          this.alertLoading(false);
          this.converseData();
          let element1: HTMLInputElement = document.getElementById('clickReloadTable') as HTMLInputElement;
          element1.click();
          this.sortData('caseID',true);
        } else {
          this.alertLoading(false);
          this.alertCalling("ไม่พบข้อมูล");
          this.butGoFindCasePage();
          return;
        }
      } else {
        this.alertCalling("ผิดพลาด! ไม่สามารถทำรายการได้ในขณะนี้");
        this.alertLoading(false);
        this.butGoFindCasePage();
        return
      }
    });
  }

  msg: string;
  alertCalling(msg: string): void {
    this.msg = msg;
    let element: HTMLInputElement = document.getElementById('callAlert') as HTMLInputElement;
    element.style.display = "block";
    element.click();
    this.alertLoading(false);
  }

  alertLoading(val: boolean): void {
    if (val === true) {
      let element: HTMLInputElement = document.getElementById('modalLoading') as HTMLInputElement;
      element.style.display = "block";
      element.click();
    } else if (val === false) {
      let element: HTMLInputElement = document.getElementById('closeModalLoading') as HTMLInputElement;
      element.style.display = "none";
      element.click();
    }
  }
  showTable: boolean = true;
  reloadTable() {
    this.showTable = false;
    setTimeout(() => { this.showTable = true }, 0);
  }

  showCard: boolean = true;
  reloadCard() {
    this.showCard = false;
    setTimeout(() => { this.showCard = true }, 0);
  }

  secrchVal: string = "";
  dataNotfound: boolean = false;
  loopRes = new Array()
  secrchCard() {
    this.alertLoading(true);
    if (this.secrchVal === "" || this.secrchVal === null || this.secrchVal === undefined) {
      this.data = this.dataReserve;
    } else {
      this.loopRes = [];
      for (let i = 0; i < this.dataReserve.length; i++) {
        if (this.dataReserve[i].caseID === this.secrchVal ||
          this.dataReserve[i].createDate === this.secrchVal ||
          this.dataReserve[i].statusCase === this.secrchVal
        ) {          
          this.loopRes.push(this.dataReserve[i]);
        }
      }
      this.data = this.loopRes;
    }
      if (this.data.length > 0) { this.dataNotfound = false } else { this.dataNotfound = true }
      this.alertLoading(false);
  }

   sortData(sortName: string , updown: boolean ) {
    this.buttonSort = { "caseID" : false , "topic": false , "statusCase": false , "dateCreate" : false }
    this.showCard = false;
    this.alertLoading(true);
    let dataSort = [];
    if (sortName === "caseID" || sortName === "topic" || sortName === "statusCase") {
      dataSort  = this.dataReserve ;
      dataSort.sort((a, b) => (a[sortName] < b[sortName]) ? 1 : -1)
      this.data = dataSort;
    } else if (sortName === "dateCreate") {
      dataSort  = this.dataReserve ;
      dataSort.sort(compareDate);
      this.data = dataSort;
    } else {
      this.alertCalling("ผิดพลาด ไม่สามารถทำรายการได้!");
      return;
    }
    function compareDate(a, b) {
      const bandA = a.createDate.toUpperCase();
      const bandB = b.createDate.toUpperCase();
      var dateA = new Date(bandA.substr(6, 6) + "-" + (Number(bandA.substr(3, 2) - 1)).toString().padStart(2, '0') + "-" + bandA.substr(0, 2));
      var dateB = new Date(bandB.substr(6, 6) + "-" + (Number(bandB.substr(3, 2) - 1)).toString().padStart(2, '0') + "-" + bandB.substr(0, 2));
      let comparison = 0;
      if (dateA.getTime() > dateB.getTime()) {
        comparison = 1;
      } else if (dateA.getTime() < dateB.getTime()) {
        comparison = -1;
      }
      return comparison;
    }

    function sortUpdown(dataObj) {
      let datatUpdown = [];
      for (let i = dataObj.length -1 ; i >= 0 ; i--) { datatUpdown.push(dataObj[i]) }
      return datatUpdown;
    }
    if (updown === true) { this.data = sortUpdown(this.data); }
    this.reloadCard();
    this.alertLoading(false);
    this.showCard = true;
  }

}
