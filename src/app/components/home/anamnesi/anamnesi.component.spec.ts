import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnamnesiComponent } from './anamnesi.component';

describe('AnamnesiComponent', () => {
  let component: AnamnesiComponent;
  let fixture: ComponentFixture<AnamnesiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnamnesiComponent]
    });
    fixture = TestBed.createComponent(AnamnesiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
