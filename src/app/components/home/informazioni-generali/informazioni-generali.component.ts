import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InformazioniGeneraliService } from 'src/app/services/informazioni-generali.service';
import { TipologicheService } from 'src/app/services/tipologiche.service';

@Component({
  selector: 'app-informazioni-generali',
  templateUrl: './informazioni-generali.component.html',
  styleUrls: ['./informazioni-generali.component.scss']
})

export class InformazioniGeneraliComponent implements OnInit {

  informazioniForm!: FormGroup;
  isConsentGiven: boolean = false;


  fototipi: any[] = [];
  lavoriPrecedenti: any[] = []
  sports: any[] = []

  constructor(private formBuilder: FormBuilder, private tipologicheService: TipologicheService, private informazioniGenerali: InformazioniGeneraliService, private router: Router, private toastr: ToastrService) {
    this.tipologicheService.getFototipi().subscribe({
      next: (res: any) => {
        this.fototipi = res
      }
    })
    this.tipologicheService.getSports().subscribe({
      next: (res: any) => {
        this.sports = res
      }
    })
    this.tipologicheService.getLavori().subscribe({
      next: (res: any) => {
        this.lavoriPrecedenti = res
      }
    })
  }

  ngOnInit() {
    this.createForm({})
    this.informazioniGenerali.getByUsername().subscribe({
      next: (res: any) => {
        this.createForm(res)
      }
    })
  }

  createForm(res: any) {
    this.informazioniForm = this.formBuilder.group({
      id: [res?.id ? res?.id : null],
      consenso: [res?.id ? true : false, Validators.required],
      bornYear: [res?.id ? res?.bornYear : 1980, Validators.required],
      sesso: [res?.id ? res?.sesso : 'M', Validators.required],
      fototipo: [res?.phototype ? res?.phototype?.id : null, Validators.required],
      trainingCourse: [res?.id ? res?.trainingCourse : false, Validators.required],
      informationExposure: [res?.id ? res?.informationExposure : false, Validators.required],
      otherJobs: [res?.id ? res?.otherJobs : false],
      otherOutdoorJobs: [res?.id ? res?.otherOutdoorJobs : false],
      works: [res?.id ? res?.works?.map((item: any) => item.id) : []],
      outdoorWorkYears: [res?.id ? res?.outdoorWorkYears : null],
      sport: [res?.id ? res?.sport : false],
      sports: [res?.id ? res?.sports?.map((item: any) => item.id) : []],
      vacancy: [res?.id ? res?.vacancy : false],
      vacancyYears: [res?.id ? res?.vacancyYears : null],
    });
  }



  submitForm() {
    if (this.informazioniForm?.valid) {
      this.informazioniGenerali.save(this.informazioniForm?.value).subscribe({
        next: (res: any) => {
          this.toastr.success('Salvataggio delle Informazioni Generali avvenuto correttamente')
          this.router.navigate(["/home/utente"])
        },

        error: (error) => {
          this.toastr.error(error)
        }
      })
    }
  }
}

