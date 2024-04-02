import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemCouponComponent } from './redeem-coupon.component';

describe('RedeemCouponComponent', () => {
  let component: RedeemCouponComponent;
  let fixture: ComponentFixture<RedeemCouponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedeemCouponComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedeemCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
