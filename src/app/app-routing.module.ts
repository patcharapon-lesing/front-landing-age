import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FindCasePageComponent } from '../app/find-case-page/find-case-page.component'
import { CreateCasePageComponent } from '../app/create-case-page/create-case-page.component'
import { DetailsPageComponent } from '../app/details-page/details-page.component'



const routes: Routes = [
 //  { path: 'token/:token' , component: LoginTokenComponent  },
  { path: '' , component: FindCasePageComponent  },
  { path: 'CreateCasePage' , component: CreateCasePageComponent ,   },
  { path: 'DetailsPage' , component: DetailsPageComponent  },
  
];



@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
