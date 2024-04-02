import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdminTemplateComponent } from './add-admin-template.component';

describe('AddAdminTemplateComponent', () => {
  let component: AddAdminTemplateComponent;
  let fixture: ComponentFixture<AddAdminTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdminTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdminTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
