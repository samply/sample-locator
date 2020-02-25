import { TestBed } from '@angular/core/testing';

import { MdrConfigService } from './mdr-config.service';

describe('MdrConfigService', () => {
  let service: MdrConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MdrConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
