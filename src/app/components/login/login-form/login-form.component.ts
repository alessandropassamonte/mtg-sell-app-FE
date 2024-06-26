import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {


  formLogin!: FormGroup
  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) { }
  ngOnInit() {
    this.formLogin = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      ruolo: ['1', [Validators.required]],
      keepConnection: [false, [Validators.required]],
    })
  }
  login() {
    this.authService.login(this.formLogin).subscribe({
      next: (res: any) => {
        const accessToken = res.token;
        const refreshToken = res.refreshToken;
        localStorage.setItem('access_token', accessToken);

        if (this.formLogin.get('keepConnection')?.value) {
          localStorage.setItem('refresh_token', refreshToken);
          localStorage.setItem('keep_connection', this.formLogin.get('keepConnection')?.value);
        }

        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(res.token);
        localStorage.setItem('username', decodedToken?.username);
        localStorage.setItem('name', decodedToken?.name);
        localStorage.setItem('lastname', decodedToken?.lastname);

        this.authService.setUser({
          username: decodedToken?.username,
          name: decodedToken?.name,
          lastName: decodedToken?.lastname,
          officialRole: decodedToken?.roles[0]
        })

      

        this.authService.accessTokenSubject.next(accessToken);
        this.router.navigate(['home']);
      }
    })
  }




}
