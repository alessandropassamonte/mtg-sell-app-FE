import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/user';
import { faEdit, faSearch, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss']
})
export class UtenteComponent implements OnInit {
  user: User | null | undefined;

  role: string = ''


  subscription = new Subscription();

  faEdit = faEdit;

  constructor(private authService: AuthService, private router: Router, private userService: UserService, private datePipe: DatePipe) {
    // this.subscription.add(this.authService.getUser().subscribe((user: User | null) => this.user = user));
  }

  ngOnInit() {
    this.userService.getUserInSession().subscribe({
      next: (res: any) => {
        this.user = res
        this.role = res?.roles[0]?.role
      }
    })
  }

  navigate(input: string) {
    this.router.navigate([input])
  }
}
