import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RicercaService } from 'src/app/services/ricerca.service';
import { TipologicheService } from 'src/app/services/tipologiche.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.scss']
})
export class RicercaComponent implements OnInit {

  searchForm!: FormGroup

  workerOptions: string[] = [];
  bodyRegionOptions: string[] = ['Testa', 'Viso', 'Schiena', 'Petto', 'Braccia', 'Piedi'];
  jobCategoryOptions: string[] = [];
  environmentOptions: string[] = [];

  risultatiMisurazioni: any[] = []

  distanze: number[] = [5, 10, 20, 30, 50, 100];

  configDate = {
    // containerClass: 'theme-dark',
    rangeInputFormat: 'DD/MM/YYYY',
    dateInputFormat: 'DD/MM/YYYY',
    showWeekNumbers: false,
    showTodayButton: false,
    todayPosition: 'center',
    isAnimated: true
  };

  map: any;
  latitude: number = 42;
  longitude: number = 13;


  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private localeService: BsLocaleService, private ricercaService: RicercaService, private tipologicheService: TipologicheService,
    private userService: UserService) {
      this.subscription.add(this.authService.getUser().subscribe((user: User | null) =>{
        
        this.user = user
        this.workerList.push(user)
      }));
    this.tipologicheService.getLavori().subscribe({
      next: (res: any) => {
        this.jobCategoryOptions = res
      }
    })
    this.tipologicheService.getAmbienteLavori().subscribe({
      next: (res: any) => {
        this.environmentOptions = res
      }
    })
    this.userService.getUserInSession().subscribe((user: any) => {
      this.user = user
      this.role = user?.roles[0].role
      this.workerList.push(this.user)
      
    });
    this.localeService.use('it');


  }

  role!: string;
  user: User | null | undefined;
  icon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [15, 45],
      iconUrl: '../../../../assets/img/marker-icon-2x.png',
      shadowUrl: '../../../../assets/img/marker-shadow.png'
    })
  };
  subscription = new Subscription();
  username: string = '';

  // workerList: any[] = [{ username: 'User1', id: 1 }, { username: 'User2', id: 2 }]

  workerList: any[] = []

  // selectedWorkers: any[] = [{ username: 'User2', id: 2 }]


  ngOnInit() {
    this.createForm()
    this.initializeMap()
   
  }

  createForm() {
    this.searchForm = this.formBuilder.group({
      workers: [[this.user], Validators.required],
      bodyRegions: ['', Validators.required],
      jobCategories: ['', Validators.required],
      environments: ['', Validators.required],
      raggio: [5, Validators.required],
      dateRange: []
    });
  }


  initializeMap() {
    this.map = L.map('map').setView([this.latitude, this.longitude], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const marker = L.marker([this.latitude, this.longitude], this.icon).addTo(this.map);

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      this.latitude = lat;
      this.longitude = lng;
    });
  }
  search() {
    this.ricercaService.getMeasureBySearch(this.searchForm.value, this.latitude, this.longitude).subscribe({
      next: (res: any) => {
        this.risultatiMisurazioni = res
      }
    })
  }

  addWorker() {
    const workerName = this.searchForm.get('workers')?.value;
  }
}
