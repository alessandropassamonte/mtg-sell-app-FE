import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnamnesiService } from 'src/app/services/anamnesi.service';
import { TipologicheService } from 'src/app/services/tipologiche.service';

@Component({
  selector: 'app-anamnesi',
  templateUrl: './anamnesi.component.html',
  styleUrls: ['./anamnesi.component.scss']
})
export class AnamnesiComponent {
  anamnesiForm!: FormGroup;
  isConsentGiven: boolean = false;

  malattieOculari: any[] = []
  eritemi: any[] = []
  cutiVoltoVolto: any[] = []
  bodyParts: any[] = []
  malattieCutanee: any[] = []

  selectedBodyParts: any[] = []
  selectedEri: any[] = []
  selectedSkin: any[] = []
  constructor(private formBuilder: FormBuilder, private tipologicheService: TipologicheService, private toastr: ToastrService, private anamnesiService: AnamnesiService, private router: Router) {
    this.anamnesiService.getByUsername().subscribe({
      next: (res: any) => {
        if (res?.id) {
          this.updateForm(res);
          this.selectedBodyParts = res.bodyParts
          this.selectedEri = res.erythemas
          this.selectedSkin = res.skinDiseases
        }
      }
    })
  }

  ngOnInit() {
    this.createNewForm()
    this.getMalattieOculari()
    this.getEritemi()
    this.getCutiVolto()
    this.getBodyParts()
    this.getMalattieCutanee()


  }

  get ustioniFrequenti() {
    return this.anamnesiForm.get('ustioniFrequenti') as FormArray;
  }

  getMalattieOculari() {
    this.tipologicheService.getMalattieOculari().subscribe({
      next: (res: any) => {
        this.malattieOculari = res
      }
    })
  }

  getEritemi() {
    this.tipologicheService.getEritemi().subscribe({
      next: (res: any) => {
        this.eritemi = res
      }
    })
  }

  getBodyParts() {
    this.tipologicheService.getPartiDelCorpo().subscribe({
      next: (res: any) => {
        this.bodyParts = res
      }
    })
  }

  getCutiVolto() {
    this.tipologicheService.getCutiVolto().subscribe({
      next: (res: any) => {
        this.cutiVoltoVolto = res
      }
    })
  }
  getMalattieCutanee() {
    this.tipologicheService.getMalattieCutanee().subscribe({
      next: (res: any) => {
        this.malattieCutanee = res
      }
    })
  }

  toggleConsent(consent: boolean) {
    this.isConsentGiven = consent;
  }

  addUstioneFrequente() {
    this.ustioniFrequenti.push(this.formBuilder.control('', Validators.required));
  }

  removeUstioneFrequente(index: number) {
    this.ustioniFrequenti.removeAt(index);
  }

  onSubmit() {
    if (!this.anamnesiForm.valid) {
      this.toastr.error('Compila tutti i campi');
    } 
  }
  createNewForm() {
    this.anamnesiForm = this.formBuilder.group({
      id: [null],
      consent: [false, Validators.required],
      sunBurnUnderage: ['', Validators.required],
      sunBurnFreeTime: ['', Validators.required],
      sunBurnAtJob: ['', Validators.required],
      bodyParts: [[]],
      erythemas: [],
      rednessFreeTime: ['', Validators.required],
      howManyTimesFreeTime: [''],
      rednessJob: ['', Validators.required],
      howManyTimesJob: [''],
      patologieOculari: this.formBuilder.group({
        destro: [],
        sinistro: []
      }),
      skinDiseases: [],
      careFaces: [null],
      doctorCompilation: [false, Validators.required]
    });
  }
  updateForm(res: any) {
    this.anamnesiForm = this.formBuilder.group({
      id: [res?.id],
      consent: [true, Validators.required],
      sunBurnUnderage: [res?.sunBurnUnderage, Validators.required],
      sunBurnFreeTime: [res?.sunBurnFreeTime, Validators.required],
      sunBurnAtJob: [res?.sunBurnAtJob, Validators.required],
      bodyParts: [res?.bodyParts],
      erythemas: [res?.erythemas],
      rednessFreeTime: [res?.rednessFreeTime, Validators.required],
      howManyTimesFreeTime: [res?.howManyTimesFreeTime],
      rednessJob: [res?.rednessJob, Validators.required],
      howManyTimesJob: [res?.howManyTimesJob],
      patologieOculari: this.formBuilder.group({
        destro: [res?.anamnesiEyeDiseases ? this.getOcchioDestro(res?.anamnesiEyeDiseases) : []],
        sinistro: [res?.anamnesiEyeDiseases ? this.getOcchioSinistro(res?.anamnesiEyeDiseases) : []]
      }),
      skinDiseases: [res?.skinDiseases],
      careFaces: [res?.careFaces],
      doctorCompilation: [res?.doctorCompilation, Validators.required]
    });
  }

  getOcchioSinistro(input: any) {
    let sinistro: any[] = []
    input.forEach((item: any) => {
      const { eye, eyeDiseases } = item;

      if (eye === 'SX') {
        sinistro.push(eyeDiseases);
      }
      return sinistro
    });

  }
  getOcchioDestro(input: any) {
    let destro: any[] = []
    input.forEach((item: any) => {
      const { eye, eyeDiseases } = item;

      if (eye === 'SX') {
        destro.push(eyeDiseases);
      }
      return destro
    });

  }

  save() {
    this.anamnesiForm.patchValue({

    })
    this.anamnesiService.save(this.anamnesiForm?.value).subscribe({
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
