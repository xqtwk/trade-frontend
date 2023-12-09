import { TestBed } from '@angular/core/testing';

import { CheckoutcomService } from './checkoutcom.service';

describe('CheckoutcomService', () => {
  let service: CheckoutcomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutcomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
