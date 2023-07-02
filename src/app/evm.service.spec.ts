import { TestBed } from '@angular/core/testing';

import { EvmService } from './evm.service';

describe('EvmService', () => {
  let service: EvmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
