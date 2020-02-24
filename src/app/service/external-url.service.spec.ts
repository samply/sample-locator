import { TestBed } from '@angular/core/testing';

import { ExternalUrlService } from './external-url.service';

describe('ExternalUrlService', () => {
  let service: ExternalUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
