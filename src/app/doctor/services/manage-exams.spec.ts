import { TestBed } from '@angular/core/testing';

import { ManageExams } from './manage-exams';

describe('ManageExams', () => {
  let service: ManageExams;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageExams);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
