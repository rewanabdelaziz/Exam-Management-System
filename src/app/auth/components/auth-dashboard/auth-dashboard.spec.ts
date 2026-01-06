import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthDashboard } from './auth-dashboard';

describe('AuthDashboard', () => {
  let component: AuthDashboard;
  let fixture: ComponentFixture<AuthDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
