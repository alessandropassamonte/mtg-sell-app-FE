import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoriComponent } from './accessori.component';

describe('AccessoriComponent', () => {
  let component: AccessoriComponent;
  let fixture: ComponentFixture<AccessoriComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccessoriComponent]
    });
    fixture = TestBed.createComponent(AccessoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
