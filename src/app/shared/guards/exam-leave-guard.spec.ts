import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { examLeaveGuard } from './exam-leave-guard';

describe('examLeaveGuard', () => {
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => examLeaveGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
