import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemIframeComponent } from './redeem-iframe.component';

describe('RedeemIframeComponent', () => {
  let component: RedeemIframeComponent;
  let fixture: ComponentFixture<RedeemIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedeemIframeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedeemIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
