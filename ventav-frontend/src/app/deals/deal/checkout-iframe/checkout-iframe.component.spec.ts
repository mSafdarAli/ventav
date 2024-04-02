import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutIframeComponent } from './checkout-iframe.component';

describe('CheckoutIframeComponent', () => {
  let component: CheckoutIframeComponent;
  let fixture: ComponentFixture<CheckoutIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutIframeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
