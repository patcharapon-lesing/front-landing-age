import { Component , TemplateRef } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-landing-age';
  topMenuInfo = "Customers Case";


  constructor( private router: Router  ) {
    
  setTheme('bs4'); // or 'bs3'
  }

  ngOnInit(): void {}

  onClickBackNav(): void {
    this.router.navigate(['']);
  }

  


}


