import { TestBed } from '@angular/core/testing';

import { SimpleResultService } from './simple-result.service';

describe('SimpleResultService', () => {
  let service: SimpleResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimpleResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
