import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisurazioniComponent } from './misurazioni.component';

describe('MisurazioniComponent', () => {
  let component: MisurazioniComponent;
  let fixture: ComponentFixture<MisurazioniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MisurazioniComponent]
    });
    fixture = TestBed.createComponent(MisurazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
