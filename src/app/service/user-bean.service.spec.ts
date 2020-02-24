import { TestBed } from '@angular/core/testing';

import { UserBeanService } from './user-bean.service';

describe('UserBeanService', () => {
  let service: UserBeanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserBeanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
