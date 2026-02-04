import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GloabalLoader } from './gloabal-loader';

describe('GloabalLoader', () => {
  let component: GloabalLoader;
  let fixture: ComponentFixture<GloabalLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GloabalLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GloabalLoader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
