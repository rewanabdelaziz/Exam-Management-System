import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewExam } from './create-new-exam';

describe('CreateNewExam', () => {
  let component: CreateNewExam;
  let fixture: ComponentFixture<CreateNewExam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewExam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewExam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
