import { TestBed } from '@angular/core/testing';

import { RapydService } from './rapyd.service';

describe('RapydService', () => {
  let service: RapydService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RapydService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
