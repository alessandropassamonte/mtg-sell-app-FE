import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformazioniGeneraliComponent } from './informazioni-generali.component';

describe('InformazioniGeneraliComponent', () => {
  let component: InformazioniGeneraliComponent;
  let fixture: ComponentFixture<InformazioniGeneraliComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformazioniGeneraliComponent]
    });
    fixture = TestBed.createComponent(InformazioniGeneraliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
