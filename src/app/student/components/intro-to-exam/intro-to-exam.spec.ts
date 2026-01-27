import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroToExam } from './intro-to-exam';

describe('IntroToExam', () => {
  let component: IntroToExam;
  let fixture: ComponentFixture<IntroToExam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroToExam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroToExam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
