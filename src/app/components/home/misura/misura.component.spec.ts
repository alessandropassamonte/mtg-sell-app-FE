import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisuraComponent } from './misura.component';

describe('MisuraComponent', () => {
  let component: MisuraComponent;
  let fixture: ComponentFixture<MisuraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MisuraComponent]
    });
    fixture = TestBed.createComponent(MisuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
