
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-create-case-page',
  templateUrl: './create-case-page.component.html',
  styleUrls: ['./create-case-page.component.css']
})
export class CreateCasePageComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean;
  numberPattern = "^[0-9]+$";
  enPattern = "^[a-zA-Z]+$";
  thPattern = "^[ก-๏\s]+$";
  imgArr = Array();
  butSelImg: boolean;
  private imageSrc: string = '';
  fileNameArr: any;
  constructor(private router: Router, private formBuilder: FormBuilder, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.urls = [];
    this.imgArr = [];
    this.butSelImg = false;
    this.submitted = false;
    this.registerForm = this.formBuilder.group({
      caseID: [''],
      caseBy: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      topic: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      statusCase: ['', [Validators.required]],
      image: [this.imgArr]
    });
  }

  urls = [];
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.urls.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  handleInputChange(e) {
    var filesAmount = e.target.files.length;
    for (let i = 0; i < filesAmount; i++) {
      var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      var pattern = /image-*/;
      var reader = new FileReader();
      if (!file.type.match(pattern)) {
        this.alertCalling('ผิดพลาด ไม่สามารถทำรายการได้ในขณะนี้');
        return;
      }
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    this.imgArr.push(this.imageSrc);
    this.butSelImg = true;
  }

  butGoCreateCasePage(): void { this.router.navigate(['CreateCasePage']); }
  butGoFindCasePage(): void { this.router.navigate(['']); }
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.alertLoading(true);
    var getDate = new Date();
    let subStrDate = `${getDate.getFullYear().toString().padStart(4, '0')}${
      (getDate.getMonth() + 1).toString().padStart(2, '0')}${getDate.getDate().toString().padStart(2, '0')}`;
    let subStr = (this.registerForm.value.statusCase.substring(0, 1) + '-') + subStrDate;
    this.registerForm.value.caseID = subStr;
    this.submitted = true;
    if (this.registerForm.invalid || this.imgArr.length <= 0) { this.alertLoading(false); return;  }
    this.apiService.insertDate(this.registerForm.value).subscribe((res: any) => {
      if (res.resultCode === "20000") {
        this.alertLoading(false);
        this.alertCalling(res.developerMessage);
        this.clearFrom();
      } else { this.alertLoading(false); this.alertCalling("ผิดพลาด! ไม่สามารถทำรายการได้ในขณะนี้"); }
    });

  }
  clearFrom(): void {
    this.ngOnInit();
  }

  msg: string;
  alertCalling(msg: string): void {
    this.alertLoading(false);
    this.msg = msg;
    let element: HTMLInputElement = document.getElementById('callAlert') as HTMLInputElement;
    element.style.display = "block";
    element.click();
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
