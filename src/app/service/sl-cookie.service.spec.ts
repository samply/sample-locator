import { TestBed } from '@angular/core/testing';

import { SlCookieService } from './sl-cookie.service';

describe('SlCookieService', () => {
  let service: SlCookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlCookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
