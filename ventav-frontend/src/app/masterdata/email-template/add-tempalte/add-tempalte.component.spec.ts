import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTempalteComponent } from './add-tempalte.component';

describe('AddTempalteComponent', () => {
  let component: AddTempalteComponent;
  let fixture: ComponentFixture<AddTempalteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTempalteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTempalteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
