import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { httpsGuard } from './https.guard';

describe('httpsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => httpsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
