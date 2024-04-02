import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIndustryComponent } from './add-industry.component';

describe('AddIndustryComponent', () => {
  let component: AddIndustryComponent;
  let fixture: ComponentFixture<AddIndustryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIndustryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
