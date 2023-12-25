import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { assetOwnerGuard } from './asset-owner.guard';

describe('assetOwnerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => assetOwnerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
