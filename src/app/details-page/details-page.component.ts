import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExcelService } from '../services/excel.services';
import { ReportDetailModel } from '../model/reportDetailModel';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent implements OnInit {
  data = new Array();
  headers = new Array();
  reportDetailModel: ReportDetailModel = new ReportDetailModel();
  constructor(
    private router: Router,
    private excelService: ExcelService,
    private apiService: ApiService,
  ) {
    this.headers = ['No.', 'Case ID', 'Topic', 'Description', 'Data Care', 'Create By contactNo', 'Status'];
    this.data = this.apiService.reportDetail;
  }

  ngOnInit(): void {
    if (this.data.length <= 0) { this.butGoFindCasePage() }
    this.converseData();
  }

  butGoFindCasePage(): void {
    this.router.navigate(['']);
  }

  butExportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.headers, this.data, this.excelService.excelFileName);
    
  }

  converseData(): void {
    let setData = new Array();
    let num = 0;
    for (let i in this.data) {
      let d = this.data[i].createDate;
      let daySrt = d.substr(8, 2) + "/" + d.substr(5, 2) + "/" + d.substr(0, 4);
      let timeSrt = d.substr(11, 8); // <-- Show Time
      setData.push(
        {
          No: num + 1,
          caseID: this.data[i].caseID,
          caseBy: this.data[i].caseBy,
          createDate: daySrt,
          topic: this.data[i].topic,
          description: this.data[i].description,
          statusCase: this.data[i].statusCase,
        }
      );
      num++;
    }
    this.data = setData;
  }






  


}
