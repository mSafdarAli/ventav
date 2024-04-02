import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCodesComponent } from './export-codes.component';

describe('ExportCodesComponent', () => {
  let component: ExportCodesComponent;
  let fixture: ComponentFixture<ExportCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportCodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
