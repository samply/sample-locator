import { TestBed } from '@angular/core/testing';

import { MdrFieldProviderService } from './mdr-field-provider.service';

describe('MdrFieldProviderService', () => {
  let service: MdrFieldProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MdrFieldProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
