import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ActivateComponent } from './activate/activate.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CardScanComponent } from './card-scan/card-scan.component';
import { CardModelComponent } from './card-scan/card-model/card-model.component';



@NgModule({
  declarations: [LoginComponent, LoginFormComponent, RegistrationFormComponent, ActivateComponent, CardScanComponent, CardModelComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    BsDatepickerModule,
    AlertModule
  ]
  
})
export class LoginModule { }
