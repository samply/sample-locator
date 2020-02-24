import { TestBed } from '@angular/core/testing';

import { InfoVersionService } from './info-version.service';

describe('InfoVersionService', () => {
  let service: InfoVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
