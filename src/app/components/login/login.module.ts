import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ActivateComponent } from './activate/activate.component';


@NgModule({
  declarations: [LoginComponent, LoginFormComponent, RegistrationFormComponent, ActivateComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    BsDatepickerModule
  ]
  
})
export class LoginModule { }
